import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { ItemService } from '../services/item.service';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from '../services/user.service';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent {
  items:number[] = [] //subscribe function inserts item ids into list
  allItems: []
  public sellerErrors:string[] = []
  constructor(private itemService: ItemService, private UserService: UserService) {
    this.UserService.sellerStatus()
    .subscribe(res => {
      this.sellerErrors = res
    })
    this.itemService.getAllItemsForUser()
    .subscribe(res => { 
      this.allItems = res  //insertion of items into list
      this.items = this.allItems.slice(0, 4) //display of items in home page without change in nav bar.
    })
    }
    handlePageEvent(e: PageEvent) {
      this.items = this.allItems.slice(e.pageSize*e.pageIndex, e.pageSize*(e.pageIndex+1)) //slice to section items (skip and take method)
    }
    public onBoard(e: Event) {
      this.UserService.onBoard(document.location.href)
      .subscribe(url => { //call to backend for onboard in user services
        document.location.href = url
      })
    } 
  }
