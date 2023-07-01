import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy {
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });
  registerSubscription: Subscription = Subscription.EMPTY;

  get controls() {
    return this.formGroup.controls;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.registerSubscription.unsubscribe();
  }

  registerUser() {
    this.registerSubscription = this.authService
      .register({
        email: this.controls['email'].value,
        password: this.controls['password'].value,
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          window.alert(err.message);
        },
      });
  }

  validatePasswords() {
    return this.controls['password'].value ===
      this.controls['confirmPassword'].value
      ? true
      : false;
  }

  validateForm() {
    return (
      this.controls['email'].hasError('required') ||
      this.controls['email'].hasError('email') ||
      this.controls['password'].hasError('required') ||
      this.controls['password'].hasError('minLength') ||
      this.controls['password'].hasError('maxLength') ||
      this.controls['confirmPassword'].hasError('required') ||
      !this.validatePasswords()
    );
  }
}
