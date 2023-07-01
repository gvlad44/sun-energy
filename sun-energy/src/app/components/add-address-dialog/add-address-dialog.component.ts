import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddressService } from 'src/app/services/address.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-add-address-dialog',
  templateUrl: './add-address-dialog.component.html',
  styleUrls: ['./add-address-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [AddressService],
})
export class AddAddressDialogComponent {
  formGroup: FormGroup = new FormGroup({
    address: new FormControl('', Validators.required),
    pod: new FormControl('', [
      Validators.required,
      Validators.minLength(15),
      Validators.maxLength(15),
    ]),
    series: new FormControl('', [
      Validators.required,
      Validators.minLength(18),
      Validators.maxLength(18),
    ]),
    index: new FormControl('', Validators.required),
  });

  get controls() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<AddAddressDialogComponent>,
    private addressService: AddressService
  ) {}

  validateForm() {
    return (
      this.controls['address'].hasError('required') ||
      this.controls['pod'].hasError('required') ||
      this.controls['pod'].hasError('minlength') ||
      this.controls['pod'].hasError('maxlength') ||
      this.controls['series'].hasError('required') ||
      this.controls['series'].hasError('minength') ||
      this.controls['series'].hasError('maxlength') ||
      this.controls['index'].hasError('required')
    );
  }

  addAddress() {
    const start_date = dayjs().add(7, 'day');

    this.addressService
      .addAddress({
        address: this.controls['address'].value,
        contractStartDate: start_date.format('DD/MM/YYYY'),
        contractEndDate: start_date.add(1, 'year').format('DD/MM/YYYY'),
        pod: this.controls['pod'].value,
        series: this.controls['series'].value,
        index: this.controls['index'].value,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close({ success: true });
        },
        error: (err) => {
          window.alert(err.message);
        },
      });
  }

  closeDialog() {
    this.dialogRef.close({ success: false });
  }
}
