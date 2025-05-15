import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthConfig, OAuthErrorEvent, OAuthService} from 'angular-oauth2-oidc';
import {BehaviorSubject, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private usernameSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly usernameObservable: Observable<string> = this.usernameSubject.asObservable();
  private useraliasSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly useraliasObservable: Observable<string> = this.useraliasSubject.asObservable();
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly accessTokenObservable: Observable<string> = this.accessTokenSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private authConfig: AuthConfig
  ) {
    this.handleEvents(null);
  }

  private _decodedAccessToken: any;

  get decodedAccessToken() {
    return this._decodedAccessToken;
  }

  private _accessToken = '';

  get accessToken() {
    return this._accessToken;
  }

  async initAuth(): Promise<any> {
    return new Promise<void>(() => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.events
        .subscribe(e => this.handleEvents(e));
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }

  public getRoles(): Observable<Array<string>> {
    return new Observable<Array<string>>(observer => {
      try {
        if (!this._decodedAccessToken) {
          console.log('Kein Token vorhanden');
          observer.next([]);
          return;
        }

        console.log('Token gefunden:', this._decodedAccessToken);

        let roles: Array<string> = [];

        // Realm Rollen prüfen
        if (this._decodedAccessToken.realm_access && this._decodedAccessToken.realm_access.roles) {
          roles = [...roles, ...this._decodedAccessToken.realm_access.roles.map((r: string) => r.replace('ROLE_', ''))];
        }

        if (this._decodedAccessToken.resource_access &&
          this._decodedAccessToken.resource_access['shop-client'] &&
          this._decodedAccessToken.resource_access['shop-client'].roles) {
          roles = [...roles, ...this._decodedAccessToken.resource_access['shop-client'].roles.map((r: string) => r.replace('ROLE_', ''))];
        }

        if (this._decodedAccessToken.resource_access &&
          this._decodedAccessToken.resource_access.demoapp &&
          this._decodedAccessToken.resource_access.demoapp.roles) {
          roles = [...roles, ...this._decodedAccessToken.resource_access.demoapp.roles.map((r: string) => r.replace('ROLE_', ''))];
        }

        console.log('Gefundene Rollen:', roles);
        observer.next(roles);
      } catch (error) {
        console.error('Fehler beim Extrahieren der Rollen:', error);
        observer.next([]);
      }
    });
  }
  public getIdentityClaims(): Record<string, any> {
    return this.oauthService.getIdentityClaims();
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public logout() {
    this.oauthService.logOut();
    this.useraliasSubject.next('');
    this.usernameSubject.next('');
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  private handleEvents(event: any) {
    if (event instanceof OAuthErrorEvent) {
      console.error(event);
    } else {
      this._accessToken = this.oauthService.getAccessToken();
      this.accessTokenSubject.next(this._accessToken);
      this._decodedAccessToken = this.jwtHelper.decodeToken(this._accessToken);

      if (this._decodedAccessToken?.family_name && this._decodedAccessToken?.given_name) {
        const username = this._decodedAccessToken?.given_name + ' ' + this._decodedAccessToken?.family_name;
        this.usernameSubject.next(username);
      }

      const claims = this.getIdentityClaims();
      if (claims !== null) {
        if (claims['preferred_username'] !== '') {
          this.useraliasSubject.next(claims['preferred_username']);
        }
      }
    }
  }
}
