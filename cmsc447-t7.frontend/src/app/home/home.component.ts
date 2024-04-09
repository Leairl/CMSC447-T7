import { Component } from '@angular/core';
import { ItemcardComponent } from '../itemcard/itemcard.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
  
})
export class HomeComponent {
  items:number[] = [1,2,3,4,5,6,7,8];
}
