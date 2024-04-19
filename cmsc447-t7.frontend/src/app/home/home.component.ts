import { Component } from '@angular/core';
import { ItemcardComponent } from '../itemcard/itemcard.component';
import { ItemService } from '../services/item.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'

})
export class HomeComponent {
  items: number[] = [] //subscribe function inserts item ids into list
  searchText: string
  allItems: []
  constructor(private itemService: ItemService) {

    this.itemService.getAllItems()
      .subscribe(res => {
        this.allItems = res  //insertion of items into list
        this.items = this.allItems.slice(0, 10) //display of items in home page without change in nav bar.
      })
  }
  handlePageEvent(e: PageEvent) {
    this.items = this.allItems.slice(e.pageSize * e.pageIndex, e.pageSize * (e.pageIndex + 1)) //slice to section items (skip and take method)
  }
  search(e: any) {
    if (e.key === "Enter") {
      
    e.preventDefault()
      this.itemService.search(this.searchText)
      .subscribe(res => {
        this.allItems = res  //insertion of items into list
        this.items = this.allItems.slice(0, 10) //display of items in home page without change in nav bar.
      })
    }
  }
}
