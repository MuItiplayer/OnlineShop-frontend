import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private keycloakService: KeycloakService, private router: Router) {}

  canActivate(): boolean {
    if (this.keycloakService.hasRole('ROLE_ADMIN')) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
