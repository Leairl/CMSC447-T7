import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { ReceiptService } from "../services/receipt.service";
import { Receipt, Item, ReceiptItem } from "../services/interfaces"
import { ActivatedRoute } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})



export class CheckoutComponent {
  currReceipt: any;
  currReceiptID: any;
  stripeURL: any;
  total: any;

  
  constructor(private receiptService: ReceiptService, private route: ActivatedRoute) {

  }
  //This does mean that when we click the checkout cart, we're gonna have to do some
  //Extra maneuvering to have the url be baseurl/receiptID in app.component.ts/html
  ngOnInit() {  //navigated to page
    this.route.params.subscribe(params => { //reading URL
      this.currReceiptID = params['receiptID']  //pulls receiptID out of URL
      this.receiptService.getReceiptById(this.currReceiptID) //get request for the receipt
        .subscribe({    //listening for result of receiptID
          next: (res) => {
            this.currReceipt = res  //returns all properties within that receipt id
            this.getTotal();
            
          },
          error: (err) => {
            alert(err?.error.message)
          }
        })
    })
  }

  onRemove(receiptItemID: number) {
    
    this.receiptService.removeItemFromReceipt(this.currReceiptID, receiptItemID) //post request for removing items
      .subscribe({    //listening for result item removal
        next: (res) => {
          this.currReceipt = res  //update receipt
          this.getTotal();
          window.location.reload();
        },
        error: (err) => {
          alert(err?.error.message)
        }
      })
  }


  //Stripe and backend are fine, but URL is just not being passed.
  //Can access the stripe stuff on my account tho so.
  checkout() {
    this.receiptService.checkoutReceipt(this.currReceiptID) //post request for removing items
      .subscribe({    //listening for result item removal
        next: (res) => {
          this.stripeURL = res;

          window.location.href = this.stripeURL;
        },
        error: (err) => {
          alert(err?.error.message)
        }
      })
  }

  getTotal() {
    if (this.currReceipt) {
      this.total = 0;

      this.currReceipt.receiptItems.forEach((receiptItem: ReceiptItem) => {
        // Add the price of the item multiplied by its quantity to the total
        this.total += receiptItem.item.price * receiptItem.item.quantity;
      });
    } else {
      // If currReceipt is null or undefined, set total to 0
      this.total = 0;
    }
  }
  



}
