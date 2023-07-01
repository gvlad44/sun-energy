import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainLayoutModule } from '../main-layout/main-layout.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { InfoComponent } from '../info/info.component';
import { InfoModule } from '../info/info.module';
import { AddressService } from 'src/app/services/address.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddAddressDialogComponent } from 'src/app/components/add-address-dialog/add-address-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ExtendContractDialogComponent } from 'src/app/components/extend-contract-dialog/extend-contract-dialog.component';
import { DeleteContractDialogComponent } from 'src/app/components/delete-contract-dialog/delete-contract-dialog.component';
import { PanelsModule } from '../panels/panels.module';
import { PanelsComponent } from '../panels/panels.component';
import { PanelComponent } from '../panel/panel.component';
import { PanelModule } from '../panel/panel.module';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent },
      {
        path: ':id',
        component: InfoComponent,
      },
      { path: ':id/panels', component: PanelsComponent },
      { path: ':id/panels/:panelId', component: PanelComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MainLayoutModule,
    MatCardModule,
    MatTableModule,
    InfoModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AddAddressDialogComponent,
    ExtendContractDialogComponent,
    DeleteContractDialogComponent,
    PanelsModule,
    PanelModule,
  ],
  exports: [RouterModule],
  declarations: [DashboardComponent],
  providers: [AddressService],
})
export class DashboardModule {}
