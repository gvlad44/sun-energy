import { NgModule } from '@angular/core';

import { FuturesComponent } from './futures.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuturesService } from 'src/app/services/futures.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: 'future',
    children: [{ path: '', component: FuturesComponent }],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
  ],
  exports: [FuturesComponent],
  declarations: [FuturesComponent],
  providers: [FuturesService],
})
export class FuturesModule {}
