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

@Component({
  selector: 'app-delete-contract-dialog',
  templateUrl: './delete-contract-dialog.component.html',
  styleUrls: ['./delete-contract-dialog.component.scss'],
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
export class DeleteContractDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address,
    private addressService: AddressService
  ) {}

  deleteContract() {
    this.addressService.deleteContract(this.data.id).subscribe({
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
