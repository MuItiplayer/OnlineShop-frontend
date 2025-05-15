import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import {importProvidersFrom, inject, provideEnvironmentInitializer, provideZoneChangeDetection} from '@angular/core';
import { AuthConfig, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { BrowserModule } from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';


export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/OnlineShopModul295',
  requireHttps: false,
  redirectUri: environment.frontendBaseUrl,
  postLogoutRedirectUri: environment.frontendBaseUrl,
  clientId: 'shop-client',
  scope: 'openid profile roles offline_access',
  responseType: 'code',
  showDebugInformation: true,
  requestAccessToken: true,
  silentRefreshRedirectUri: environment.frontendBaseUrl + '/silent-refresh.html',
  silentRefreshTimeout: 500,
  clearHashAfterLogin: true,
};

export function storageFactory(): OAuthStorage {
  return sessionStorage;
}

import { AppAuthService } from './app/services/app.auth.service';
import {environment} from './app/environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes),
    importProvidersFrom(
      BrowserModule,
      OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
    ),
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthStorage, useFactory: storageFactory },
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    provideAnimations(),
    provideEnvironmentInitializer(() => {
      inject(AppAuthService).initAuth().finally()
    })
  ]
})
.catch((err) => console.error(err));
