import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserResponse } from 'src/app/interfaces/user-auth.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnDestroy {
  hidePassword: boolean = true;
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loginSubscription: Subscription = Subscription.EMPTY;

  get controls() {
    return this.formGroup.controls;
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  login() {
    this.loginSubscription = this.authService
      .login({
        email: this.controls['email'].value,
        password: this.controls['password'].value,
      })
      .subscribe({
        next: (res) => {
          const userRes = res as any as UserResponse;
          this.authService.saveUserData(userRes.result);
          this.router.navigateByUrl('/dashboard');
        },
        error: () => {},
      });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
