import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { Panel, PanelResponse } from 'src/app/interfaces/panel.interface';
import { AddressService } from 'src/app/services/address.service';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss'],
})
export class PanelsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'output', 'produced'];
  dataSource: Panel[] = [];
  addressId: string = '';
  currentAddress!: Address;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private panelService: PanelService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.getAddressId();
    this.initAddress();
    this.initPanels();
  }

  getAddressId() {
    this.route.params.subscribe((params) => {
      this.addressId = params['id'];
    });
  }

  initAddress() {
    this.addressService.getAddress(this.addressId).subscribe({
      next: (apiRes) => {
        const res = apiRes as AddressResponse;
        this.currentAddress = res.results[0];
      },
    });
  }

  initPanels() {
    this.panelService.getPanels(this.addressId).subscribe({
      next: (apiRes) => {
        const res = apiRes as PanelResponse;
        res.results.sort((a, b) => a.name.localeCompare(b.name));
        this.dataSource = res.results;
      },
      error: () => {
        this.dataSource = [];
      },
    });
  }

  getLastMonth() {
    return moment(this.dataSource[0].metrics[0].timestamp, 'MM/YYYY').format(
      'MMMM'
    );
  }

  navigateToPanelPage(row) {
    this.router.navigateByUrl(`/dashboard/${this.addressId}/panels/${row.id}`);
  }

  goBack() {
    this.location.back();
  }
}
