import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ItemComponent } from './item/item.component';
import { UserComponent } from './user/user.component';
import { ListingComponent } from './listing/listing.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent},
  { path: 'listing', component: ListingComponent},
  { path: "item/:itemId", component: ItemComponent }, /*item/:itemId in url path goes to ItemComponent*/
  { path: "checkout/:receiptID", component: CheckoutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}, /*pathmatch = redirected home url is exact */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
