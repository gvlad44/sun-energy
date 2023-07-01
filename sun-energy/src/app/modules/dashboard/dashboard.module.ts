import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainLayoutModule } from '../main-layout/main-layout.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { InfoComponent } from '../info/info.component';
import { InfoModule } from '../info/info.module';

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
  ],
  exports: [RouterModule],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
