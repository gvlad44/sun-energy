import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';

//CERERE PENTRU O NOUA ADRESA (ADD)
//CERERE STERGERE ADRESA
//CERERE PRELUNGIRE CONTRACT

const ELEMENT_DATA: Address[] = [
  {
    position: 1,
    id: 1,
    address: 'Soseaua Alexandriei 29',
    energy_rate: 0.25,
    contract_start_date: dayjs('2022-04-04T16:00:00.000Z').format('DD/MM/YYYY'),
    contract_end_date: dayjs('2023-04-04T16:00:00.000Z').format('DD/MM/YYYY'),
  },
  {
    position: 2,
    id: 2,
    address: 'Calea Dorobantilor 5',
    energy_rate: 0.25,
    contract_start_date: dayjs('2022-02-14T12:30:00.000Z').format('DD/MM/YYYY'),
    contract_end_date: dayjs('2023-02-14T12:30:00.000Z').format('DD/MM/YYYY'),
  },
  {
    position: 3,
    id: 3,
    address: 'Bulevardul Tineretului 25',
    energy_rate: 0.28,
    contract_start_date: dayjs('2022-05-09T10:00:00.000Z').format('DD/MM/YYYY'),
    contract_end_date: dayjs('2023-05-09T10:00:00.000Z').format('DD/MM/YYYY'),
  },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'position',
    'address',
    'energy_rate',
    'contract_start_date',
    'contract_end_date',
  ];
  dataSource = ELEMENT_DATA;
  addressesSubscription: Subscription = Subscription.EMPTY;

  constructor(private router: Router, private addressService: AddressService) {}

  ngOnInit() {
    this.initAddresses();
  }

  ngOnDestroy() {
    this.addressesSubscription.unsubscribe();
  }

  initAddresses() {
    this.addressesSubscription = this.addressService.getAddresses().subscribe({
      next: (apiRes) => {
        console.log(apiRes);
      },
      error: () => {},
    });
  }

  navigateToInfoPage(row) {
    this.router.navigateByUrl(`/dashboard/${row.id}`);
  }
}
