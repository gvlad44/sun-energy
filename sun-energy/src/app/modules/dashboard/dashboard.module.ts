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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddAddressDialogComponent } from 'src/app/components/add-address-dialog/add-address-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent },
      { path: ':id', component: InfoComponent },
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
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    AddAddressDialogComponent,
  ],
  exports: [RouterModule],
  declarations: [DashboardComponent],
  providers: [AddressService],
})
export class DashboardModule {}
