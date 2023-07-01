import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddListingDialogComponent } from 'src/app/components/add-listing-dialog/add-listing-dialog.component';
import { DeleteListingDialogComponent } from 'src/app/components/delete-listing-dialog/delete-listing-dialog.component';
import { Future, FutureResponse } from 'src/app/interfaces/futures.interface';
import { FuturesService } from 'src/app/services/futures.service';

@Component({
  selector: 'app-futures',
  templateUrl: './futures.component.html',
  styleUrls: ['./futures.component.scss'],
})
export class FuturesComponent implements OnInit {
  displayedColumns: string[] = [
    'quantity',
    'rate',
    'total',
    'maturityDate',
    'createdAt',
    'status',
    'actions',
  ];
  dataSource!: MatTableDataSource<Future>;
  @ViewChild('paginator') paginator!: MatPaginator;

  displayedColumnsBought: string[] = [
    'quantity',
    'rate',
    'total',
    'maturityDate',
    'createdAt',
    'boughtAt',
  ];
  dataSourceBought!: MatTableDataSource<Future>;
  @ViewChild('paginatorBought') paginatorBought!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private futuresService: FuturesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initTable();
    this.initBoughtTable();
  }

  initTable() {
    this.futuresService.getUserListedFutures().subscribe({
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

  initBoughtTable() {
    this.futuresService.getBoughtListings().subscribe({
      next: (apiRes) => {
        const res = apiRes as FutureResponse;
        res.results.sort((a, b) => a.boughtAt.localeCompare(b.boughtAt));
        this.dataSourceBought = new MatTableDataSource<Future>(res.results);
        this.dataSourceBought.paginator = this.paginatorBought;
      },
      error: () => {},
    });
  }

  applyFilterBought(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceBought.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceBought.paginator) {
      this.dataSourceBought.paginator.firstPage();
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

  addListing() {
    this.openDialog(AddListingDialogComponent);
  }

  deleteListing(row) {
    this.openDialog(DeleteListingDialogComponent, row.id);
  }

  navigateToMarket() {
    this.router.navigateByUrl('/future/market');
  }
}
