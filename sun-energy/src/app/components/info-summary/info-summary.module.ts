import { NgModule } from '@angular/core';

import { InfoSummaryComponent } from './info-summary.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [InfoSummaryComponent],
  declarations: [InfoSummaryComponent],
})
export class InfoSummaryModule {}
