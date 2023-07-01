import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  ],
  providers: [FuturesService],
})
export class BuyListingDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuyListingDialogComponent>,
    private futuresService: FuturesService
  ) {}

  buyListing() {
    this.futuresService.buyListedFuture(this.data).subscribe({
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
