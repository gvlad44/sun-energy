import { NgModule } from '@angular/core';

import { PanelComponent } from './panel.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from 'src/app/components/chart/chart.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    ChartModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [PanelComponent],
  declarations: [PanelComponent],
  providers: [],
})
export class PanelModule {}
