import { Component } from '@angular/core';
import { ChartData } from 'src/app/interfaces/chart.interface';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  firstChart: ChartData = {
    labels: ['September', 'October', 'November', 'December', 'January'],
    data: [
      {
        name: 'kWh',
        values: [100, 80, 90, 110, 85],
      },
      {
        name: 'RON',
        values: [25, 20, 22.5, 27.5, 21.25],
      },
    ],
  };

  secondChart: ChartData = {
    labels: ['September', 'October', 'November', 'December', 'January'],
    data: [
      {
        name: 'kWh',
        values: [130, 156, 210, 170, 140],
      },
    ],
  };
}
