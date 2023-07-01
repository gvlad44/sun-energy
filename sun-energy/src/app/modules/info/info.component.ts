import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatestWith } from 'rxjs';
import { ChartOptions } from 'src/app/components/chart/chart-options';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { ChartData } from 'src/app/interfaces/chart.interface';
import {
  Panel,
  PanelMetrics,
  PanelResponse,
} from 'src/app/interfaces/panel.interface';
import { AddressService } from 'src/app/services/address.service';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  action: string = 'Produced';
  secondAction: string = 'Accumulated*';
  thirdAction: string = 'Consumed';

  producedChart: ChartData = {
    labels: [],
    data: [
      {
        name: 'kWh',
        values: [],
      },
      {
        name: 'RON',
        values: [],
      },
    ],
  };

  consumedChart: ChartData = {
    labels: [],
    data: [
      {
        name: 'kWh',
        values: [],
      },
    ],
  };
  addressId: string = '';
  panels!: Panel[];
  address!: Address;
  chartOptions1: any;
  chartOptions2: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private panelService: PanelService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.getAddressId();
    this.initData();
  }

  getAddressId() {
    this.route.params.subscribe((params) => {
      this.addressId = params['id'];
    });
  }

  initData() {
    const panel$ = this.panelService.getPanels(this.addressId);
    const address$ = this.addressService.getAddress(this.addressId);

    panel$
      .pipe(combineLatestWith(address$))
      .subscribe(([panelRes, addressRes]) => {
        this.panels = (panelRes as PanelResponse).results;
        this.address = (addressRes as AddressResponse).results[0];
        this.parseConsumedData(this.address);
        this.parseProducedData(this.panels);
        this.buildChart();
      });
  }

  parseConsumedData(address: Address) {
    for (const metric of address.consumed!) {
      this.consumedChart.labels.unshift(
        moment(metric.timestamp, 'MM/YYYY').format('MMMM')
      );
      this.consumedChart.data[0].values.unshift(Number(metric.newIndex));
    }
  }

  parseProducedData(panels: Panel[]) {
    this.initProducedChartLabels(panels[0]);
    this.initProducedChartData(panels);
    this.formatProducedData();
  }

  initProducedChartLabels(panel: Panel) {
    for (const metric of panel.metrics) {
      this.producedChart.labels.unshift(
        moment(metric.timestamp, 'MM/YYYY').format('MMMM')
      );
    }
    this.producedChart.data[0].values = Array(
      this.producedChart.labels.length
    ).fill(0);
    this.producedChart.data[1].values = Array(
      this.producedChart.labels.length
    ).fill(0);
  }

  initProducedChartData(panels: Panel[]) {
    for (const panel of panels) {
      for (const metric of panel.metrics) {
        this.producedChart.data[0].values[panel.metrics.indexOf(metric)] +=
          Number(metric.produced);
        this.producedChart.data[1].values[panel.metrics.indexOf(metric)] +=
          Number(metric.produced * this.address.rate);
      }
    }
  }

  formatProducedData() {
    this.producedChart.data[0].values =
      this.producedChart.data[0].values.reverse();

    this.producedChart.data[1].values =
      this.producedChart.data[1].values.reverse();

    for (let idx = 0; idx < this.producedChart.data[0].values.length; idx++) {
      this.producedChart.data[0].values[idx] = Number(
        this.producedChart.data[0].values[idx].toFixed(2)
      );
      this.producedChart.data[1].values[idx] = Number(
        this.producedChart.data[1].values[idx].toFixed(2)
      );
    }
  }

  buildChart() {
    let chartOptions1 = new ChartOptions(this.producedChart);
    this.chartOptions1 = chartOptions1;
    let chartOptions2 = new ChartOptions(this.consumedChart);
    this.chartOptions2 = chartOptions2;
  }

  computeMonth(idx: number, chartData: ChartData) {
    return chartData.data[idx].values.at(-1)?.toFixed(2);
  }

  computeTotal(idx: number, chartData: ChartData) {
    return chartData.data[idx].values.reduce((a, b) => a + b, 0).toFixed(2);
  }

  computeAverage(idx: number, chartData: ChartData) {
    return (
      chartData.data[idx].values.reduce((a, b) => a + b, 0) /
      chartData.data[idx].values.length
    ).toFixed(2);
  }

  navigateToPanelsPage() {
    this.router.navigateByUrl(`/dashboard/${this.addressId}/panels`);
  }
}
