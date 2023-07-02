import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith } from 'rxjs';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { Bill, BillResponse } from 'src/app/interfaces/bills.interface';
import { AddressService } from 'src/app/services/address.service';
import { BillsService } from 'src/app/services/bills.service';

@Component({
  selector: 'app-address-bills',
  templateUrl: './address-bills.component.html',
  styleUrls: ['./address-bills.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatExpansionModule,
  ],
  providers: [BillsService],
})
export class AddressBillsComponent implements OnInit {
  addressId = '';
  bills!: Bill[];
  address!: Address;

  constructor(
    private route: ActivatedRoute,
    private billsService: BillsService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.getAddressId();
    this.initData();
  }

  initData() {
    const bills$ = this.billsService.getBills(this.addressId);
    const address$ = this.addressService.getAddress(this.addressId);

    bills$
      .pipe(combineLatestWith(address$))
      .subscribe(([panelRes, addressRes]) => {
        this.bills = (panelRes as BillResponse).results
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
          .reverse();
        this.address = (addressRes as AddressResponse).results[0];
      });
  }

  getAddressId() {
    this.route.params.subscribe((params) => {
      this.addressId = params['id'];
    });
  }

  computeOldIndex(address: Address) {
    let index = Number(address.index!);
    for (const metric of address.consumed!) {
      index += metric.newIndex;
    }
    return index - address.consumed![0].newIndex;
  }

  computeNewIndex(address: Address) {
    let index = Number(address.index!);
    for (const metric of address.consumed!) {
      index += metric.newIndex;
    }

    return index;
  }

  computeTotal(bill: Bill) {
    if (bill.total == 0) {
      return 'You have nothing to pay or receive.';
    }
    return bill.total > 0
      ? `You have to pay ${bill.total} RON.`
      : `You will receive ${Math.abs(bill.total)} RON.`;
  }
}
