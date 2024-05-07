import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from './theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { UserClaim, UserService } from './services/user.service';
import { ReceiptService } from './services/receipt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isDarkMode: boolean;
  userClaims: UserClaim[] = [];
  receiptNum: any;
  constructor(private themeService: ThemeService, public user: UserService, public receiptService: ReceiptService) {
    this.themeService.initTheme(); /* gets data from the initTheme in theme Service to display color */
    this.isDarkMode = this.themeService.isDarkMode(); /* gets data from the isdarkmode in theme Service to display dark mode */




    this.user.isSignedIn().subscribe({
      // If we're signed in
      next: (res) => {
        this.user.user().subscribe({
          //Grab user ID
          next: (userClaims) => {
            const userIdClaim = userClaims.find(claim => claim.type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid');
            
            if (userIdClaim) {
              const userId = parseInt(userIdClaim.value, 10);
              //After getting userID, check if receipts exist
              this.receiptService.getReceiptsByUserId(userId).subscribe({
                next: (res) => {
                  //If they do, make that the ID for the cart
                  this.receiptNum = res[res.length - 1].id;
                },
                error: (res) => {
                  //Otherwise, make a new one
                  this.receiptService.createReceipt(userId).subscribe({
                    next: (res) => {
                      this.receiptService.getReceiptsByUserId(userId).subscribe({
                        next: (res) => {
                          this.receiptNum = res[res.length - 1].id;
                        }
                      })
                    },
                    error: (err) => { alert("Bruh") }
                  })
                }
              });
            }
          }
        });
      }
    });
    
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



}

