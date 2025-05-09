import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { KeycloakService } from './app/services/keycloak.service';

const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(
        withInterceptors([
          (req, next) => {
            const token = keycloakService.getToken();
            const authReq = token
              ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
              : req;
            return next(authReq);
          }
        ])
      ),
      { provide: KeycloakService, useValue: keycloakService },
      ...appConfig.providers
    ]
  });
});
