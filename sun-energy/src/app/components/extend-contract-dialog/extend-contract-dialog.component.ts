import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Address } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-extend-contract-dialog',
  templateUrl: './extend-contract-dialog.component.html',
  styleUrls: ['./extend-contract-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
  ],
  providers: [AddressService],
})
export class ExtendContractDialogComponent {
  options = [
    { value: 6, text: '6 months' },
    { value: 12, text: '12 months' },
  ];

  selectedValue = this.options[1].value;

  constructor(
    public dialogRef: MatDialogRef<ExtendContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address,
    private addressService: AddressService,
    private toastr: ToastrService
  ) {}

  extendContract() {
    const date = moment(this.data.contractEndDate, 'DD/MM/YYYY')
      .add(this.selectedValue, 'month')
      .format('DD/MM/YYYY');

    this.addressService.extendContract(this.data.id, date).subscribe({
      next: () => {
        this.dialogRef.close({ success: true });
      },
      error: () => {
        this.toastr.error(
          'There was an issue with the request! Please try again!'
        );
      },
    });
  }

  closeDialog() {
    this.dialogRef.close({ success: false });
  }
}
