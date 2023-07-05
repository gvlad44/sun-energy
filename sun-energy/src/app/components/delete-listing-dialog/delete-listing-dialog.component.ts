import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { FuturesService } from 'src/app/services/futures.service';

@Component({
  selector: 'app-delete-listing-dialog',
  templateUrl: './delete-listing-dialog.component.html',
  styleUrls: ['./delete-listing-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  providers: [FuturesService],
})
export class DeleteListingDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteListingDialogComponent>,
    private futuresService: FuturesService,
    private toastr: ToastrService
  ) {}

  deleteListing() {
    this.futuresService.deleteListedFuture(this.data).subscribe({
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
