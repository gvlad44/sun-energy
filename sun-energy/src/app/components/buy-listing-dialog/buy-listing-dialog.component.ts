import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';
import { FuturesService } from 'src/app/services/futures.service';

@Component({
  selector: 'app-buy-listing-dialog',
  templateUrl: './buy-listing-dialog.component.html',
  styleUrls: ['./buy-listing-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
  ],
  providers: [FuturesService, AddressService],
})
export class BuyListingDialogComponent implements OnInit {
  addresses: Address[] = [];
  selectedAddress = '';

  formGroup: FormGroup = new FormGroup({
    address: new FormControl(this.selectedAddress),
  });

  get controls() {
    return this.formGroup.controls;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuyListingDialogComponent>,
    private futuresService: FuturesService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.initAddresses();
  }

  initAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = (res as AddressResponse).results;
        this.initAddressesSelect();
      },
      error: (err) => {},
    });
  }

  initAddressesSelect() {
    this.addresses = this.addresses.filter(
      (address) => address.status == 'Active'
    );
    this.selectedAddress = this.addresses[0].address;
  }

  buyListing() {
    this.futuresService
      .buyListedFuture(
        this.data,
        this.addresses.find(
          (address) => this.selectedAddress == address.address
        )?.id!
      )
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
