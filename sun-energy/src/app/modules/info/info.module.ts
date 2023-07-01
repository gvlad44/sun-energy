import { NgModule } from '@angular/core';

import { InfoComponent } from './info.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from 'src/app/components/chart/chart.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatCardModule, ChartModule, MatButtonModule],
  declarations: [InfoComponent],
  exports: [InfoComponent],
})
export class InfoModule {}
