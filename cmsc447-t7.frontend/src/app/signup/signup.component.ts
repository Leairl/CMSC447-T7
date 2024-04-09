import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { confirmPasswordValidator } from './confirm-password.validator';
import { UserService } from '../services/user.service';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'

})
export class SignupComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]);
  confirm_password = new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]);

  signupForm: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
    confirm_password: this.confirm_password,
  },
    {
      validators: confirmPasswordValidator
    });
  errorMessage = '';
  confirmPasswordPatternErrorMessage = [];
  passwordPatternErrorMessage = [];

  constructor(private user: UserService) {
    merge(this.email.statusChanges, this.email.valueChanges)  /* updates when user types a character for email*/
      .pipe(takeUntilDestroyed()) /* .pipe - gets values from the events, typed a character in the field*/
      .subscribe(() => this.updateErrorEmailMessage()); /* .subscribe - update events(status and value changes) when events are activated (call events on field for frontend display)*/
      merge(this.password.statusChanges, this.password.valueChanges)  /* updates when user types a character for password*/
      .pipe(takeUntilDestroyed()) /* .pipe - gets values from the events, typed a character in the field*/
      .subscribe(() => this.updateErrorPasswordMessage()); /* .subscribe - update events(status and value changes) when events are activated (call events on field for frontend display)*/
      merge(this.confirm_password.statusChanges, this.confirm_password.valueChanges)  /* updates when user types a character for confirming password*/
      .pipe(takeUntilDestroyed()) /* .pipe - gets values from the events, typed a character in the field*/
      .subscribe(() => this.updateErrorConfirmPasswordMessage()); /* .subscribe - update events(status and value changes) when events are activated (call events on field for frontend display)*/
  }
  onSignup() {
    if (this.signupForm.valid) {  /* validation check */
    var data = {
      email: this.email.value,
      passwordHash: this.password.value,
    }
    this.user.signup(data) /* send login info to database for checking*/
    .subscribe({
      next:(res)=>{
        alert(res.message)
      },
      error:(err)=>{
        alert(err?.error.message)
      }
    })
    }
  }
  updateErrorEmailMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }

  }
  updateErrorPasswordMessage() {
    this.passwordPatternErrorMessage = [];
    if (this.password.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.password.hasError('pattern')) {
      if (!this.password?.value?.match('^(?=.*[A-Z])')) {
        this.passwordPatternErrorMessage.push('At least one uppercase letter.')
      }
      if (!this.password?.value?.match('(?=.*[a-z])')) {
        this.passwordPatternErrorMessage.push('At least one lowercase letter.')
      }
      if (!this.password?.value?.match('(.*[0-9].*)')) {
        this.passwordPatternErrorMessage.push('At least one digit.')
      }
      if (!this.password?.value?.match('(?=.*[!@#$%^&*])')) {
        this.passwordPatternErrorMessage.push('At least one special character.')
      }
      if (!this.password?.value?.match('.{8,}')) {
        this.passwordPatternErrorMessage.push('At least 8 characters.')
      }
    }else {
      this.errorMessage = '';
    }

  }
  updateErrorConfirmPasswordMessage() {
    this.confirmPasswordPatternErrorMessage = [];
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.confirm_password.hasError('pattern')) {
      if (this.confirm_password?.value?.match('^(?=.*[A-Z])')) {
        this.confirmPasswordPatternErrorMessage.push('At least one uppercase letter.')
      }
      if (this.confirm_password?.value?.match('(?=.*[a-z])')) {
        this.confirmPasswordPatternErrorMessage.push('At least one lowercase letter.')
      }
      if (this.confirm_password?.value?.match('(.*[0-9].*)')) {
        this.confirmPasswordPatternErrorMessage.push('At least one digit.')
      }
      if (this.confirm_password?.value?.match('(?=.*[!@#$%^&*])')) {
        this.confirmPasswordPatternErrorMessage.push('At least one special character.')
      }
      if (this.confirm_password?.value?.match('.{8,}')) {
        this.confirmPasswordPatternErrorMessage.push('At least 8 characters.')
      }
    } else {
      this.errorMessage = '';
    }

  }
}