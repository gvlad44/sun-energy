import { NgModule } from '@angular/core';

import { MainLayoutComponent } from './main-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { AuthInterceptor } from 'src/app/utils/auth.interceptor';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
  ],
  exports: [MainLayoutComponent],
  declarations: [MainLayoutComponent],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router, authService: AuthService) {
        return new AuthInterceptor(router, authService);
      },
      multi: true,
      deps: [Router, AuthService],
    },
  ],
})
export class MainLayoutModule {}
