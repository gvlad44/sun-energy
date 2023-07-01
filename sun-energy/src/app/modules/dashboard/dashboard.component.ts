import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddAddressDialogComponent } from 'src/app/components/add-address-dialog/add-address-dialog.component';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';

//CERERE STERGERE ADRESA
//CERERE PRELUNGIRE CONTRACT
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'address',
    'status',
    'energy_rate',
    'contract_start_date',
    'contract_end_date',
  ];
  dataSource: Address[] = [];

  constructor(
    private router: Router,
    private addressService: AddressService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initAddresses();
  }

  initAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (apiRes) => {
        const res = apiRes as AddressResponse;
        res.results.sort((a, b) => a.address.localeCompare(b.address));
        this.dataSource = res.results;
      },
      error: () => {},
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddAddressDialogComponent, {
      autoFocus: false,
      width: '35%',
    });

    dialogRef.afterClosed().subscribe(({ success }) => {
      if (success) this.initAddresses();
    });
  }

  navigateToInfoPage(row) {
    this.router.navigateByUrl(`/dashboard/${row.id}`);
  }
}
