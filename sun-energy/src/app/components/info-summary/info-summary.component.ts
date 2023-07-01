import { Component, Input } from '@angular/core';
import { ChartData } from 'src/app/interfaces/chart.interface';

@Component({
  selector: 'app-info-summary',
  templateUrl: './info-summary.component.html',
  styleUrls: ['./info-summary.component.scss'],
})
export class InfoSummaryComponent {
  @Input() action: string = '';
  @Input() secondAction?: string = '';
  @Input() chartData!: ChartData;

  computeMonth(idx: number) {
    return this.chartData.data[idx].values.at(-1)?.toFixed(2);
  }

  computeTotal(idx: number) {
    return this.chartData.data[idx].values.reduce((a, b) => a + b, 0);
  }

  computeAverage(idx: number) {
    return (
      this.chartData.data[idx].values.reduce((a, b) => a + b, 0) /
      this.chartData.data[idx].values.length
    );
  }
}
