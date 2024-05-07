import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../services/item.service';
import { formatDate } from '@angular/common';
import { UserClaim, UserService } from '../services/user.service';
import { ReceiptService } from '../services/receipt.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  itemId: any;
  item: any;
  images: any;
  receipts: any;
  constructor(private itemService: ItemService, private route: ActivatedRoute, public user: UserService, private receiptService: ReceiptService){ // using itemService to get item info (get request),called once when browser is refreshed
    this.user.isSignedIn().subscribe( //execution of isSignedIn to get data from backend
    )
  } 
  ngOnInit() {  //navigated to page
    this.route.params.subscribe(params => { //reading URL
      this.itemId = params['itemId']  //pulls itemId out of URL
      this.itemService.item(this.itemId) //get request for that item id
      .subscribe({    //listening for result of item id
        next:(res)=>{
              this.item = res  //returns all properties within that item id
              const format = 'dd/MM/yyyy';
              const myDate = this.item.createDate;
              const locale = 'en-US';
              this.item.createDate = formatDate(myDate, format, locale);
                    },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
      })
    }
    handleEvent(event: any) {
      console.log(`${event.name} has been clicked on img ${event.imageIndex + 1}`);
  
      switch (event.name) {
        case 'print':
          console.log('run print logic');
          break;
      }
  }
  newItem() {
    //Check if user signed in
    if (this.user.hasSignedIn) {
      //Get user ID
      this.user.user().subscribe({
        next: (userClaims) => {
          const userIdClaim = userClaims.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid');
          if (userIdClaim) {
            const userId = parseInt(userIdClaim.value, 10);
            //Check if there is a receipt currently
            this.receiptService.getReceiptsByUserId(userId).subscribe({
              next: (res) => {
                this.receiptService.addItemToReceipt(res[res.length - 1].id, this.itemId).subscribe({
                  next: (res) => {
                    alert("Successfully added!")
                  },
                  error: (err) => {
                    alert("Unsuccessfully added, try a different item.")
                  }
                })
              },
              //Otherwise, make a new receipt and then add
              error: (err) => {
                this.receiptService.createReceipt(userId).subscribe({
                  next: (res) => {
                    //get that new receipt
                    this.receiptService.getReceiptsByUserId(userId).subscribe({
                      next: (res) => {
                        //Add
                        this.receiptService.addItemToReceipt(res[res.length - 1].id, this.itemId).subscribe({
                          next: (res) => {
                            alert("Successfully added!")
                          },
                          error: (err) => {
                            alert("Unsuccessfully added, try a different item.")
                          }
                        })
                      }
                    })
                  },
                  error: (err) => {
                    alert(err?.error.message)
                  }

                })

              }
            })

          } else {
            alert("User ID not found in claims");
          }
        },
        error: (err) => {
          alert("Error occurred while fetching user claims");
        }
      });
    } else {
      alert("You must be signed in to add to your cart!");
    }
  }
}
