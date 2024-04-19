import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../services/item.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  itemId: any;
  item: any;
  images: any;
  constructor(private itemService: ItemService, private route: ActivatedRoute){ // using itemService to get item info (get request),called once when browser is refreshed

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

}
