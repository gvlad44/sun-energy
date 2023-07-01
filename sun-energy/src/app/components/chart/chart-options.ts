import { ChartData } from 'src/app/interfaces/chart.interface';

export class ChartOptions {
  yAxisLabels: string[] = [];
  firstSeriesData: number[] = [];
  secondSeriesData: number[] = [];

  series: any[] = [];

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

  options: any = {
    tooltip: null,
    grid: null,
    yAxis: null,
    xAxis: null,
    series: null,
  };

  constructor(chartData: ChartData) {
    this.yAxis.data = chartData.labels!;

    for (const series of chartData.data) {
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

  getOptions() {
    return this.options;
  }
}
