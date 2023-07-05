import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });

  get controls() {
    return this.formGroup.controls;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  registerUser() {
    this.authService
      .register({
        email: this.controls['email'].value,
        password: this.controls['password'].value,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Signed up successfully!');
          this.router.navigateByUrl('/login');
        },
        error: () => {
          this.toastr.error(
            'There was an issue with the request! Please try again!'
          );
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
