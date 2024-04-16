import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  itemId: any;
  item: any;
  constructor(private itemService: ItemService, private route: ActivatedRoute){ // using itemService to get item info (get request)

  } 
  ngOnInit() {
    this.route.params.subscribe(params => { //reading URL
      this.itemId = params['itemId']  //pulls itemId out of URL
      this.itemService.item(this.itemId)
      .subscribe({    //listening for result using pulled out itemId from URL
        next:(res)=>{
              this.item = res
                    },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
      })
    }
}
