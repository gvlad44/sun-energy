import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddListingDialogComponent } from 'src/app/components/add-listing-dialog/add-listing-dialog.component';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private futuresService: FuturesService
  ) {}

  ngOnInit() {
    this.initTable();
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
}
