import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatestWith } from 'rxjs';
import { ChartOptions } from 'src/app/components/chart/chart-options';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { ChartData } from 'src/app/interfaces/chart.interface';
import { Panel, PanelResponse } from 'src/app/interfaces/panel.interface';
import { AddressService } from 'src/app/services/address.service';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  action: string = 'Produced';
  secondAction: string = 'Accumulated';
  chartData: ChartData = {
    labels: [],
    data: [
      { name: 'kWh', values: [] },
      { name: 'RON', values: [] },
    ],
  };
  addressId: string = '';
  address!: Address;
  panelId: string = '';
  panel: Panel = {
    id: '',
    name: '',
    output: 0,
    metrics: [],
    addressId: '',
    userId: '',
  };
  chartOptions: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private panelService: PanelService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.getRouteIds();
    this.initData();
  }

  getRouteIds() {
    this.route.params.subscribe((params) => {
      this.addressId = params['id'];
      this.panelId = params['panelId'];
    });
  }

  initData() {
    const panel$ = this.panelService.getPanel(this.panelId);
    const address$ = this.addressService.getAddress(this.addressId);

    panel$
      .pipe(combineLatestWith(address$))
      .subscribe(([panelRes, addressRes]) => {
        this.panel = (panelRes as PanelResponse).results[0];
        this.address = (addressRes as AddressResponse).results[0];
        this.parseData();
        this.buildChart();
      });
  }

  parseData() {
    for (const metric of this.panel.metrics) {
      this.chartData.labels.unshift(
        moment(metric.timestamp, 'MM/YYYY').format('MMMM')
      );
      this.chartData.data[0].values.unshift(Number(metric.produced));
      this.chartData.data[1].values.unshift(
        Number((metric.produced * this.address.rate).toFixed(2))
      );
    }
  }

  buildChart() {
    let chartOptions = new ChartOptions(this.chartData);
    this.chartOptions = chartOptions;
  }

  computeMonth(idx: number) {
    return this.chartData.data[idx].values.at(-1);
  }

  computeTotal(idx: number) {
    return this.chartData.data[idx].values
      .reduce((a, b) => a + b, 0)
      .toFixed(2);
  }

  computeAverage(idx: number) {
    return (
      this.chartData.data[idx].values.reduce((a, b) => a + b, 0) /
      this.chartData.data[idx].values.length
    ).toFixed(2);
  }
}
