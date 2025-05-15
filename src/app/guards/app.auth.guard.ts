import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppAuthService } from '../services/app.auth.service';
import { lastValueFrom } from 'rxjs';

export const appCanActivate = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AppAuthService);
  const router = inject(Router);

  console.log('Guard aktiviert für Route:', state.url);

  const isAuthenticated = authService.isAuthenticated();
  console.log('Ist authentifiziert:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('Nicht authentifiziert, Weiterleitung zu /login');
    //router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //return false;
  }

  const requiredRoles = route.data['roles'] as Array<string>;

  if (requiredRoles && requiredRoles.length > 0) {
    try {
      console.log('Erforderliche Rollen für diese Route:', requiredRoles);

      const userRoles = await lastValueFrom(authService.getRoles());
      console.log('Benutzerrollen aus Token:', userRoles);

      const hasRequiredRole = requiredRoles.some(requiredRole =>
        userRoles.includes(requiredRole)
      );

      if (!hasRequiredRole) {
        console.error('Keine erforderliche Rolle gefunden. Zugriff verweigert.');
        console.error('Benötigte Rollen:', requiredRoles);
        console.error('Vorhandene Rollen:', userRoles);
        router.navigate(['/']);
        return false;
      }

      console.log('Rolle gefunden, Zugriff erlaubt');
    } catch (error) {
      console.error('Fehler bei der Rollenprüfung:', error);
      router.navigate(['/']);
      return false;
    }
  }

  console.log('Zugriff gewährt für Route:', state.url);
  return true;
};
