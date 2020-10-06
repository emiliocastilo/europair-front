import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OAuthErrorEvent,
  OAuthEvent,
  OAuthService,
  OAuthSuccessEvent,
} from 'angular-oauth2-oidc';
import { oAuthConfig } from './core/models/auth.config';
import { SESSION_STORAGE_KEYS } from './core/models/session-storage-keys';
import { LOGIN_TYPES } from './modules/login/models/login-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'europair-management-front';

  constructor(private _oauthService: OAuthService, private _router: Router) {}

  ngOnInit(): void {
    if (
      Object.is(
        sessionStorage.getItem(SESSION_STORAGE_KEYS.LOGIN_TYPE),
        LOGIN_TYPES.OAUTH
      )
    ) {
      this._oauthService.configure(oAuthConfig);
      this._oauthService.loadDiscoveryDocumentAndLogin().then(() => {
        if (this._oauthService.getIdentityClaims()) {
          console.log(this._oauthService.getIdentityClaims()['name']);
          sessionStorage.setItem(
            'USER-NAME',
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

  private onOAuthSuccessEvent(event: OAuthEvent) {
    console.log(event);
    if (
      event instanceof OAuthSuccessEvent &&
      Object.is(event.type, 'discovery_document_loaded')
    ) {
      this._router.navigate(['tasks'], { queryParamsHandling: 'merge' });
    }
  }
}
