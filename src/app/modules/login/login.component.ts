import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import {
  InputTextIcon,
  InputTextIconPositions,
} from 'src/app/core/models/basic/input-text/input-text-icon';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { oAuthConfig } from 'src/app/core/models/auth.config';
import { SESSION_STORAGE_KEYS } from 'src/app/core/models/session-storage-keys';
import { LOGIN_TYPES } from './models/login-types';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public userIconConfig: InputTextIcon;
  public passwordIconConfig: InputTextIcon;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private fb: FormBuilder,
    private _oauthService: OAuthService
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.userIconConfig = {
      icon: 'person',
      position: InputTextIconPositions.RIGHT,
    };
    this.passwordIconConfig = {
      icon: 'vpn_key',
      position: InputTextIconPositions.RIGHT,
    };
  }

  public onExternalLogin() {
    this._authService
      .login(this.loginForm.value)
      .subscribe(this.setTokenOnSessionStorage);
  }

  private setTokenOnSessionStorage = (response) => {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.AUTH_TOKEN, response.jwtToken);
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.USER_NAME,
      this.userNameControl.value
    );
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.LOGIN_TYPE,
      LOGIN_TYPES.INTERNAL
    );
    this._router.navigate([this._authService.getRedirectLoginUrl()]);
  };

  public onAzureLogin() {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_LOGIN_LAST_ACTION, JSON.stringify(true));
    sessionStorage.setItem(SESSION_STORAGE_KEYS.LOGIN_TYPE, LOGIN_TYPES.OAUTH);
    this._oauthService.configure(oAuthConfig);
    if (this._oauthService.hasValidAccessToken()) {
      this._router.navigate([this._authService.getRedirectLoginUrl()]);
    } else {
      this._oauthService.loadDiscoveryDocumentAndLogin();
    }
  }

  private get userNameControl(): AbstractControl {
    return this.loginForm.get('username');
  }
}
