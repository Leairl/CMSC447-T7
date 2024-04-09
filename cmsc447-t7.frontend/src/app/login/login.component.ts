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
  password = new FormControl('', [Validators.required]);
  signedIn: boolean = false;
  errorMessage = '';

  loginForm: FormGroup = new FormGroup({ /* groups properties for logging in */
    email: this.email,
    passwordHash: this.password,
  })
  constructor(private user: UserService, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
      this.user.isSignedIn().subscribe(
        isSignedIn => {
            this.signedIn = isSignedIn; /* requests to backend and asks if user is signed in */
        });
  }
onLogin() {
  if (this.loginForm.valid) {  /* validation check */
  this.user.login(this.loginForm.value) /* send login info to database for checking*/
  .subscribe({
    next:(res)=>{
        if (res.isSuccess) {
          this.router.navigate(['home']);
        }
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
