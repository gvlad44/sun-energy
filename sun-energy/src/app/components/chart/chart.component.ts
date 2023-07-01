import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'src/app/interfaces/chart.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() chartData!: ChartData;
  yAxisLabels: string[] = [];
  firstSeriesData: number[] = [];
  secondSeriesData: number[] = [];

  tooltip = {
    trigger: 'item',
    axisPointer: {
      type: 'shadow',
    },
    position: 'top',
  };

  grid = {
    left: '3%',
    right: '3%',
    top: '3%',
    bottom: '3%',
    containLabel: true,
  };

  xAxis = {
    type: 'value',
    position: 'top',
    axisLabel: {
      show: false,
    },
  };

  yAxis = {
    type: 'category',
    axisLabel: {
      align: 'right',
    },
    axisTick: {
      show: false,
    },
    data: this.yAxisLabels,
  };

  series: any[] = [];

  options = {};

  ngOnInit(): void {
    this.yAxis.data = this.chartData.labels!;

    for (const series of this.chartData.data) {
      this.series.push({
        name: series.name,
        type: 'bar',
        emphasis: { focus: 'series' },
        data: series.values,
      });
    }

    this.options = {
      tooltip: this.tooltip,
      grid: this.grid,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      series: this.series,
    };
  }
}
