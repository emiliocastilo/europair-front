import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  OAuthErrorEvent,
  OAuthEvent,
  OAuthService,
  OAuthSuccessEvent,
} from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { oAuthConfig } from './core/models/auth.config';
import { SESSION_STORAGE_KEYS } from './core/models/session-storage-keys';
import { AuthService } from './core/services/auth.service';
import { SpinnerService } from './core/services/spinner.service';
import { LOGIN_TYPES } from './modules/login/models/login-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'europair-management-front';
  public spinner$: Observable<boolean> = this._spinnerService.getVisibility$();

  constructor(
    private _oauthService: OAuthService,
    private _router: Router,
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    // this language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang('es');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this._translateService.use('es');
    if (
      Object.is(
        sessionStorage.getItem(SESSION_STORAGE_KEYS.LOGIN_TYPE),
        LOGIN_TYPES.OAUTH
      )
    ) {
      this._oauthService.configure(oAuthConfig);
      this._oauthService.loadDiscoveryDocumentAndLogin().then(() => {
        this.afterLoginNavigateTo();
        if (this._oauthService.getIdentityClaims()) {
          sessionStorage.setItem(
            SESSION_STORAGE_KEYS.USER_NAME,
            this._oauthService.getIdentityClaims()['name']
          );
        }
      });
      this._oauthService.events.subscribe((e) =>
        e instanceof OAuthErrorEvent
          ? console.error(e)
          : this.onOAuthSuccessEvent(e)
      );
      this._oauthService.setupAutomaticSilentRefresh();
    }
  }

  private afterLoginNavigateTo() {
    if (this.isLoginLastAction()) {
      this._router.navigate([this._authService.getRedirectLoginUrl()]);
    }
  }

  private isLoginLastAction(): boolean {
    // Redirect only if login was last action (before app was destroyed)
    const item = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.IS_LOGIN_LAST_ACTION
    );
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.IS_LOGIN_LAST_ACTION);
    if (item) {
      const isLoginLastAction = JSON.parse(item);
      return isLoginLastAction;
    } else {
      return false;
    }
  }

  private onOAuthSuccessEvent(event: OAuthEvent) {
    console.log(event);
    if (event instanceof OAuthSuccessEvent && event.type !== 'token_received') {
    }
  }
}
