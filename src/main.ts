import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { importProvidersFrom, inject, provideEnvironmentInitializer } from '@angular/core';
import { AuthConfig, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const environment = {
  production: false,
  frontendBaseUrl: window.location.origin,
};

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/OnlineShopModul295',
  requireHttps: false,
  redirectUri: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  clientId: 'shop-client',
  scope: 'openid profile roles offline_access',
  responseType: 'code',
  showDebugInformation: true,
  requestAccessToken: true,
  silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
  silentRefreshTimeout: 500,
  clearHashAfterLogin: true,
};

export function storageFactory(): OAuthStorage {
  return localStorage;
}

import { AppAuthService } from './app/services/app.auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      BrowserModule,
      OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
    ),
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthStorage, useFactory: storageFactory },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideEnvironmentInitializer(() => {
      const authService = inject(AppAuthService);
      return authService.initAuth().then(() => {
        console.log('Auth Service initialized');
      }).catch(error => {
        console.error('Error initializing Auth Service', error);
      });
    })
  ]
})
.catch((err) => console.error(err));
