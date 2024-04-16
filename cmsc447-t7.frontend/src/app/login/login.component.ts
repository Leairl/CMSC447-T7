import {Component} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required])
  errorMessage = '';

  loginForm: FormGroup = new FormGroup({ /* groups properties for logging in */
    email: this.email,
    passwordHash: this.password,
  })
  constructor(public user: UserService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
    this.user.isSignedIn().subscribe(  //execution of isSignedIn for hasSignedIn which includes an update on email in frontend
    )
  }
onLogin() {
  if (this.loginForm.valid) {  /* validation check */
  this.user.login(this.loginForm.value) /* send login info to database for checking*/
  .subscribe({
    next:()=>{
          this.user.isSignedIn().subscribe(
            isSignedIn => {
                this.router.navigate(['home']); /*returns to home page after we have logged in */
            });
    },
    error:(err)=>{
      alert(err?.error.message)
    }
  })
  }
}
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }
}
