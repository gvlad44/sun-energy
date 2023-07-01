import { NgModule } from '@angular/core';

import { PanelsComponent } from './panels.component';
import { AddressService } from 'src/app/services/address.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { PanelService } from 'src/app/services/panel.service';

@NgModule({
  imports: [MatCardModule, CommonModule, MatTableModule],
  exports: [PanelsComponent],
  declarations: [PanelsComponent],
  providers: [AddressService, PanelService],
})
export class PanelsModule {}
