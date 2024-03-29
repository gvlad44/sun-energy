import { NgModule } from '@angular/core';

import { MainLayoutComponent } from './main-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { InfoComponent } from '../info/info.component';
import { PanelsComponent } from '../panels/panels.component';
import { PanelComponent } from '../panel/panel.component';
import { FuturesComponent } from '../futures/futures.component';
import { MarketComponent } from '../market/market.component';
import { BillsComponent } from '../bills/bills.component';
import { AddressBillsComponent } from '../address-bills/address-bills.component';
import { DataComponent } from '../data/data.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
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
      {
        path: 'future',
        children: [
          { path: '', component: FuturesComponent },
          {
            path: 'market',
            component: MarketComponent,
          },
        ],
      },
      {
        path: 'bills',
        children: [
          { path: '', component: BillsComponent },
          {
            path: ':id',
            component: AddressBillsComponent,
          },
        ],
      },
      {
        path: 'data',
        component: DataComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
  ],
  exports: [MainLayoutComponent],
  declarations: [MainLayoutComponent],
  providers: [AuthService],
})
export class MainLayoutModule {}
