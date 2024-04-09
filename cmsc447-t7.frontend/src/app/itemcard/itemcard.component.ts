import { Component, Input } from '@angular/core';

@Component({
  selector: 'itemcard',
  templateUrl: './itemcard.component.html',
  styleUrl: './itemcard.component.scss',
})
export class ItemcardComponent {
  @Input() itemId: number = 0;
}
