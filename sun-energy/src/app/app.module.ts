import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AuthInterceptor } from './utils/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
