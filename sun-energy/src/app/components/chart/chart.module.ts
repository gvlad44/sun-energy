import { NgModule } from '@angular/core';

import { ChartComponent } from './chart.component';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [ NgxEchartsModule.forRoot({ echarts })],
  exports: [ChartComponent],
  declarations: [ChartComponent],
  providers: [],
})
export class ChartModule {}
