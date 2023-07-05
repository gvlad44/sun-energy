import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AuthInterceptor } from './utils/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right',
    }),
  ],
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
  bootstrap: [AppComponent],
})
export class AppModule {}
