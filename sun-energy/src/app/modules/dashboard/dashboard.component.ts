import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AddAddressDialogComponent } from 'src/app/components/add-address-dialog/add-address-dialog.component';
import { DeleteContractDialogComponent } from 'src/app/components/delete-contract-dialog/delete-contract-dialog.component';
import { ExtendContractDialogComponent } from 'src/app/components/extend-contract-dialog/extend-contract-dialog.component';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';

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
    'actions',
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

  openDialog(compoenent: any, data?: any) {
    const dialogRef = this.dialog.open(compoenent, {
      data: data ? data : null,
      autoFocus: false,
      width: '35%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(({ success }) => {
      if (success) this.initAddresses();
    });
  }

  addAddress() {
    this.openDialog(AddAddressDialogComponent);
  }

  disableContractExtension(row) {
    const startDate = moment(row.contractStartDate, 'DD/MM/YYYY');
    const endDate = moment(row.contractEndDate, 'DD/MM/YYYY');

    return endDate.diff(startDate, 'month') < 6 ? false : true;
  }

  extendContract(row) {
    this.openDialog(ExtendContractDialogComponent, row as Address);
  }

  deleteContract(row) {
    this.openDialog(DeleteContractDialogComponent, row as Address);
  }

  navigateToInfoPage(row) {
    this.router.navigateByUrl(`/dashboard/${row.id}`);
  }
}
