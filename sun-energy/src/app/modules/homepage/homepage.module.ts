import { NgModule } from '@angular/core';
import { HomepageComponent } from './homepage.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: '', component: HomepageComponent }];

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
  ],
  exports: [RouterModule],
})
export class HomepageModule {}
