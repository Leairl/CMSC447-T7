import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'itemcard',
  templateUrl: './itemcard.component.html',
  styleUrl: './itemcard.component.scss',
})
export class ItemcardComponent {
  @Input() itemId: number = 0;
  constructor(private router: Router) {

  }
  onClick() {
    this.router.navigate(['item/' + this.itemId]); //onClick function to redirects to a new navigation page for a unique itemId
  }
}
