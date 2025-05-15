import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppAuthService } from '../../services/app.auth.service';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  hasValidRole: boolean = false;
  username: string = '';
  userRoles: string[] = [];

  constructor(
    private authService: AppAuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('HomeComponent initialisiert');

    this.isLoggedIn = this.authService.isAuthenticated();
    console.log('Authentifizierungsstatus:', this.isLoggedIn);

    if (!this.isLoggedIn) {
      console.log('Nicht authentifiziert, Weiterleitung zur Login-Seite');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.usernameObservable.subscribe(name => {
      this.username = name;
    });

    try {
      this.userRoles = await firstValueFrom(this.authService.getRoles());
      console.log('Benutzerrollen:', this.userRoles);

      this.hasValidRole = this.userRoles.some(role =>
        ['ADMIN', 'USER'].includes(role)
      );

      if (!this.hasValidRole) {
        console.log('Keine gültige Rolle, Zugriff verweigert');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Rollen:', error);
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    console.log('Logout ausgelöst');
    this.authService.logout();
  }

  hasAdminRole(): boolean {
    return this.userRoles.includes('ADMIN');
  }
}
