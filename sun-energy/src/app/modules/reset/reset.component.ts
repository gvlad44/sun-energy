import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [AuthService, ToastrService],
})
export class ResetComponent {
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  get controls() {
    return this.formGroup.controls;
  }

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  sendEmail() {
    this.authService.reset({ email: this.controls['email'].value }).subscribe({
      next: () => {
        this.toastr.success('An e-mail was sent to your address!');
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.toastr.error(
          'There was an issue with the request! Please try again!'
        );
      },
    });
  }
}
