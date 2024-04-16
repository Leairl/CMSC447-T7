import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'itemcard',
  templateUrl: './itemcard.component.html',
  styleUrl: './itemcard.component.scss',
})
export class ItemcardComponent {
  @Input() itemId: number = 0;
  public item: any; //item within database 
  constructor(private router: Router, private itemService: ItemService) {

  }
  onClick() {
    this.router.navigate(['item/' + this.itemId]); //onClick function to redirects to a new navigation page for a unique itemId
  }
  ngOnInit() {  //pulling item from backend
      this.itemService.item(this.itemId) //http request in itemService allows for backend retrieval
      .subscribe({    //listening for result using pulled out itemId
        next:(res)=>{
              this.item = res
                    },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
      }
    }
