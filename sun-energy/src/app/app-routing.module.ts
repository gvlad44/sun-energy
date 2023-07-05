import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './modules/main-layout/main-layout.component';
import { ResetComponent } from './modules/reset/reset.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/homepage/homepage.module').then(
        (m) => m.HomepageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./modules/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: 'reset',
    component: ResetComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./modules/futures/futures.module').then((m) => m.FuturesModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./modules/bills/bills.module').then((m) => m.BillsModule),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
