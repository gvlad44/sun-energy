import { NgModule } from '@angular/core';

import { PanelsComponent } from './panels.component';
import { AddressService } from 'src/app/services/address.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { PanelService } from 'src/app/services/panel.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    MatCardModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [PanelsComponent],
  declarations: [PanelsComponent],
  providers: [AddressService, PanelService],
})
export class PanelsModule {}
