import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  hidePassword: boolean = true;

  constructor(private router: Router) {}

  login() {
    this.router.navigateByUrl('/dashboard');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
