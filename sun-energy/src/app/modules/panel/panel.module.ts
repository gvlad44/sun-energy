import { NgModule } from '@angular/core';

import { PanelComponent } from './panel.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from 'src/app/components/chart/chart.module';

@NgModule({
  imports: [CommonModule, MatCardModule, ChartModule],
  exports: [PanelComponent],
  declarations: [PanelComponent],
  providers: [],
})
export class PanelModule {}
