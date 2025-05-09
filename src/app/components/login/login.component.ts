import { Component } from '@angular/core';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private keycloakService: KeycloakService) {}

  login(): void {
    this.keycloakService.login();
  }



  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  getUsername(): string | undefined {
    return this.keycloakService.getUsername();
  }
}
