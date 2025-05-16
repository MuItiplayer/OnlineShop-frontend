
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('realms/OnlineShopModul295')) {
      return next.handle(request);
    }

    const token = this.oauthService.getAccessToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    if (!request.headers.has('Content-Type') && !request.url.includes('upload')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Accept-Header setzen
    if (!request.headers.has('Accept')) {
      request = request.clone({
        setHeaders: {
          'Accept': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.oauthService.logOut();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.router.navigate(['/forbidden']);
        }

        return throwError(() => error);
      })
    );
  }
}
