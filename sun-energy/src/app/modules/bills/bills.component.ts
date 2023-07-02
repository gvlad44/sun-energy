import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent {
  displayedColumns: string[] = [
    'address',
    'status',
    'energy_rate',
    'contract_start_date',
    'contract_end_date',
  ];
  dataSource: Address[] = [];

  constructor(private router: Router, private addressService: AddressService) {}

  ngOnInit() {
    this.initAddresses();
  }

  initAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (apiRes) => {
        const res = apiRes as AddressResponse;
        res.results = res.results.filter(
          (address) => address.status == 'Active'
        );
        res.results.sort((a, b) => a.address.localeCompare(b.address));
        this.dataSource = res.results;
      },
      error: () => {},
    });
  }

  navigateToAddressBillsPage(row) {
    this.router.navigateByUrl(`/bills/${row.id}`);
  }
}
