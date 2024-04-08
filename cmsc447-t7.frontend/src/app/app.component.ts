import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from './theme.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isDarkMode: boolean;

constructor(private themeService: ThemeService) {
  this.themeService.initTheme(); /* gets data from the initTheme in theme Service to display color */
  this.isDarkMode = this.themeService.isDarkMode(); /* gets data from the isdarkmode in theme Service to display dark mode */
}
  toggleDarkMode() {
    this.isDarkMode = this.themeService.isDarkMode();
    if (this.isDarkMode) {
      this.themeService.update('light-mode');
    } else {
      this.themeService.update('dark-mode');
    }
    this.isDarkMode = ! this.isDarkMode
  }
}

