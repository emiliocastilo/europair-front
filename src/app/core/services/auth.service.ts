import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SESSION_STORAGE_KEYS } from '../models/session-storage-keys';
import { LOGIN_TYPES } from 'src/app/modules/login/models/login-types';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.apiUrl}login`;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _oAuthService: OAuthService
  ) {}

  public login(userData: {
    username: string;
    password: string;
  }): Observable<any> {
    return this._httpClient.post(this.url, userData);
  }

  public closeSession() {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.LOGIN_TYPE);
    if (
      Object.is(
        LOGIN_TYPES.OAUTH,
        sessionStorage.getItem(SESSION_STORAGE_KEYS.LOGIN_TYPE)
      )
    ) {
      this._oAuthService.logOut();
    } else {
      sessionStorage.clear();
      this._router.navigate(['/login']);
    }
  }

  public isLoggedIn(): boolean {
    if (
      LOGIN_TYPES.OAUTH ===
      sessionStorage.getItem(SESSION_STORAGE_KEYS.LOGIN_TYPE)
    ) {
      return this.isOAuthLoggedIn();
    } else {
      return this.isInternalLoggedIn();
    }
  }

  private isOAuthLoggedIn(): boolean {
    if (this._oAuthService.hasValidIdToken()) {
      return true;
    }
    return false;
  }

  private isInternalLoggedIn(): boolean {
    const token: string = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.AUTH_TOKEN
    );
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  public getRedirectLoginUrl(): string {
    return (
      sessionStorage.getItem(SESSION_STORAGE_KEYS.LOGIN_REDIRECT_URL) ?? 'tasks'
    );
  }

  public setRedirectLoginUrl(url: string): void {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.LOGIN_REDIRECT_URL, url);
  }
}
