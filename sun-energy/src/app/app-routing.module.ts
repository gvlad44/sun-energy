import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/homepage/homepage.module').then(
        (m) => m.HomepageModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/main-layout/main-layout.module').then(
        (m) => m.MainLayoutModule
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
