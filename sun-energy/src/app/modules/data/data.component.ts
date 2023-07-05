import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import * as moment from 'moment';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { combineLatestWith } from 'rxjs';
import { Future } from 'src/app/interfaces/futures.interface';
import { BillsService } from 'src/app/services/bills.service';
import { FuturesService } from 'src/app/services/futures.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  standalone: true,
  imports: [MatCardModule, NgxEchartsModule],
  providers: [
    BillsService,
    FuturesService,
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts: () => import('echarts') },
    },
  ],
})
export class DataComponent implements OnInit {
  labels: string[] = [];
  billsRevenue: number[] = [];
  futuresRevenue: number[] = [];
  futures = [];
  options: any = {
    tooltip: null,
    grid: null,
    yAxis: null,
    xAxis: null,
    series: null,
  };

  constructor(
    private billsService: BillsService,
    private futuresService: FuturesService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    const bills$ = this.billsService.getAllBillsRevenue();
    const futures$ = this.futuresService.getAllFutures();

    bills$
      .pipe(combineLatestWith(futures$))
      .subscribe(([billsRes, futuresRes]) => {
        this.parseBillsData((billsRes as any).results);
        this.futures = (futuresRes as any).results;
        this.futuresRevenue = this.parseFuturesData(this.futures);
        this.options = this.buildChart(
          this.labels,
          this.billsRevenue,
          this.futuresRevenue
        );
      });
  }

  parseBillsData(billsRes: any[]) {
    for (const bill of billsRes) {
      this.labels.push(bill.timestamp);
      this.billsRevenue.push(bill.value);
    }
  }

  parseFuturesData(futures: Future[]) {
    const revenue: number[] = [];
    for (let i = 0; i <= 11; i++) {
      let metric = 0;
      metric +=
        futures.filter((future) =>
          moment()
            .month(i)
            .isBetween(
              moment(future.boughtAt, 'DD/MM/YYYY'),
              moment(future.maturityDate, 'DD/MM/YYYY'),
              'month',
              '(]'
            )
        ).length > 0
          ? futures
              .filter((future) =>
                moment()
                  .month(i)
                  .isBetween(
                    moment(future.boughtAt, 'DD/MM/YYYY'),
                    moment(future.maturityDate, 'DD/MM/YYYY'),
                    'month',
                    '(]'
                  )
              )
              .map((future) => Number((future.total / 12).toFixed(2)))
              .reduce((a, b) => a + b, 0)
          : 0;
      revenue.push(metric);
    }
    return revenue;
  }

  buildChart(
    labels: string[],
    billsRevenue: number[],
    futuresRevenue: number[]
  ) {
    let tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      position: 'top',
    };

    let grid = {
      left: '3%',
      right: '3%',
      top: '3%',
      bottom: '3%',
      containLabel: true,
    };

    let xAxis = {
      type: 'category',
      position: 'top',
      axisTick: {
        show: false,
      },
      data: labels,
    };

    let yAxis = {
      type: 'value',
      axisLabel: {
        show: false,
      },
    };

    let series = [
      {
        name: 'Electricity revenue (RON)',
        stack: 'total',
        type: 'bar',
        emphasis: { focus: 'series' },
        data: billsRevenue,
      },
      {
        name: 'Futures commission revenue (RON)',
        stack: 'total',
        type: 'bar',
        emphasis: { focus: 'series' },
        data: futuresRevenue,
      },
    ];

    let options: any = {
      tooltip: tooltip,
      grid: grid,
      yAxis: yAxis,
      xAxis: xAxis,
      series: series,
    };

    return options;
  }

  computeBillsTotal() {
    return Number(this.billsRevenue.reduce((a, b) => a + b, 0).toFixed(2));
  }

  computeFuturesTotal() {
    return Number(this.futuresRevenue.reduce((a, b) => a + b, 0).toFixed(2));
  }

  computeTotal() {
    return Number(
      (
        this.billsRevenue.reduce((a, b) => a + b, 0) +
        this.futuresRevenue.reduce((a, b) => a + b, 0)
      ).toFixed(2)
    );
  }
}
