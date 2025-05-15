import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  keycloak!: Keycloak;

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'OnlineShopModul295',
        clientId: 'shop-client'
      });

      this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        flow: 'standard',
        pkceMethod: 'S256'
      }).then(authenticated => {
        console.log('Keycloak initialized successfully', authenticated);
        resolve(authenticated);
      }).catch(err => {
        console.error('Keycloak initialization failed', err);
        reject(err);
      });
    });
  }


  login(): void {
    console.log('Login method called');
    try {
      this.keycloak.login({
        redirectUri: window.location.origin + '/products'
      });
    } catch (error) {
      console.error('Fehler beim Login-Versuch:', error);
    }
  }
}
