import { Component } from '@angular/core';
import { ItemcardComponent } from '../itemcard/itemcard.component';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
  
})
export class HomeComponent {
  items:number[] = [] //subscribe function inserts item ids into list
  constructor(private itemService: ItemService) {

  this.itemService.getAllItems()
  .subscribe(res => { 
    this.items = res  //insertion of items into list
  })
  }
}
