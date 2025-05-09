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
        onLoad: 'login-required',
        flow: 'standard',
        pkceMethod: 'S256'
      }).then(authenticated => {
        resolve(authenticated);
      }).catch(err => reject(err));
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.authenticated;
  }

  getUsername(): string {
    return (this.keycloak.tokenParsed as any)?.preferred_username;
  }

  login(): void {
    this.keycloak.login({
      redirectUri: window.location.origin + '/products'
    });
  }


  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }
}
