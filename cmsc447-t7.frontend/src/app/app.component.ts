import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from './theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { UserClaim, UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isDarkMode: boolean;
  userClaims: UserClaim[] = [];
  signedIn: boolean = false;
  constructor(private themeService: ThemeService, private user: UserService) {
    this.themeService.initTheme(); /* gets data from the initTheme in theme Service to display color */
    this.isDarkMode = this.themeService.isDarkMode(); /* gets data from the isdarkmode in theme Service to display dark mode */
    this.user.isSignedIn().subscribe(
      isSignedIn => {
          this.signedIn = isSignedIn; /* requests to backend and asks if user is signed in */
      });
      this.getUser();      
  }
  toggleDarkMode() {
    this.isDarkMode = this.themeService.isDarkMode();
    if (this.isDarkMode) {
      this.themeService.update('light-mode');
    } else {
      this.themeService.update('dark-mode');
    }
    this.isDarkMode = !this.isDarkMode
  }
  getUser() {
    this.user.user().subscribe(
      result => {
        this.userClaims = result;
        console.log(this.userClaims)
      });
  }
}

