import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

//CERERE PENTRU O NOUA ADRESA (ADD)
//CERERE STERGERE ADRESA
//CERERE PRELUNGIRE CONTRACT

interface Address {
  position: number;
  id: number;
  address: string;
  energy_rate: number;
  contract_start_date: string;
  contract_end_date: string;
}

const ELEMENT_DATA: Address[] = [
  {
    position: 1,
    id: 1,
    address: 'Soseaua Alexandriei 29',
    energy_rate: 0.25,
    contract_start_date: dayjs('2022-04-04T16:00:00.000Z').format(
      'DD/MM/YYYY - HH:mm'
    ),
    contract_end_date: dayjs('2023-04-04T16:00:00.000Z').format(
      'DD/MM/YYYY - HH:mm'
    ),
  },
  {
    position: 2,
    id: 2,
    address: 'Calea Dorobantilor 5',
    energy_rate: 0.25,
    contract_start_date: dayjs('2022-02-14T12:30:00.000Z').format(
      'DD/MM/YYYY - HH:mm'
    ),
    contract_end_date: dayjs('2023-02-14T12:30:00.000Z').format(
      'DD/MM/YYYY - HH:mm'
    ),
  },
  {
    position: 3,
    id: 3,
    address: 'Bulevardul Tineretului 25',
    energy_rate: 0.28,
    contract_start_date: dayjs('2022-05-09T10:00:00.000Z').format(
      'DD/MM/YYYY - HH:mm'
    ),
    contract_end_date: dayjs('2023-05-09T10:00:00.000Z').format(
      'DD/MM/YYYY - HH:mm'
    ),
  },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'position',
    'address',
    'energy_rate',
    'contract_start_date',
    'contract_end_date',
  ];
  dataSource = ELEMENT_DATA;

  constructor(private router: Router) {}

  navigateToInfoPage(row) {
    this.router.navigateByUrl(`/dashboard/${row.id}`);
  }
}
