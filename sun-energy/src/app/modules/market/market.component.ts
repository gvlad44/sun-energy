import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BuyListingDialogComponent } from 'src/app/components/buy-listing-dialog/buy-listing-dialog.component';
import { Future, FutureResponse } from 'src/app/interfaces/futures.interface';
import { FuturesService } from 'src/app/services/futures.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatDialogModule,
    CommonModule,
  ],
  providers: [FuturesService],
})
export class MarketComponent implements OnInit {
  displayedColumns: string[] = [
    'quantity',
    'rate',
    'total',
    'maturityDate',
    'createdAt',
    'actions',
  ];
  dataSource!: MatTableDataSource<Future>;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private futuresService: FuturesService,
    private location: Location
  ) {}

  ngOnInit() {
    this.initTable();
  }

  initTable() {
    this.futuresService.getAvailableListings().subscribe({
      next: (apiRes) => {
        const res = apiRes as FutureResponse;
        res.results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        this.dataSource = new MatTableDataSource<Future>(res.results);
        this.dataSource.paginator = this.paginator;
      },
      error: () => {},
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(component: any, data?: any) {
    const dialogRef = this.dialog.open(component, {
      data: data ? data : null,
      autoFocus: false,
      width: '35%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(({ success }) => {
      if (success) this.initTable();
    });
  }

  buyListedFuture(row) {
    this.openDialog(BuyListingDialogComponent, row.id);
  }

  goBack() {
    this.location.back();
  }
}
