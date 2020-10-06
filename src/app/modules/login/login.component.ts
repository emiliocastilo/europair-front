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

  public onLogin() {
    console.log(this.loginForm.value);
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
    this._router.navigate(['/tasks']);
  };

  public onAzureLogin() {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.LOGIN_TYPE, LOGIN_TYPES.OAUTH);
    this._oauthService.configure(oAuthConfig);
    this._oauthService.loadDiscoveryDocumentAndLogin();
    // this._oauthService
    //   .loadDiscoveryDocumentAndLogin() // If we're still not logged in yet, try with a silent refresh:
    //   // Get username, if possible.
    //   .then(() => {
    //     console.log('holaaaaaaaaaaaaa');
    //     if (this._oauthService.getIdentityClaims()) {
    //       console.log(this._oauthService.getIdentityClaims()['name']);
    //       sessionStorage.setItem(
    //         'USER-NAME',
    //         this._oauthService.getIdentityClaims()['name']
    //       );
    //     }
    //   });
    // Load information from Auth0 (could also be configured manually)
    // this._oauthService
    //   .loadDiscoveryDocument()

    //   // See if the hash fragment contains tokens (when user got redirected back)
    //   .then(() => this._oauthService.tryLogin())

    //   // If we're still not logged in yet, try with a silent refresh:
    //   .then(() => {
    //     if (!this._oauthService.hasValidAccessToken()) {
    //       return this._oauthService.silentRefresh();
    //     }
    //   })

    //   // Get username, if possible.
    //   .then(() => {
    //     if (this._oauthService.getIdentityClaims()) {
    //       console.log(this._oauthService.getIdentityClaims()['name']);
    //       sessionStorage.setItem(
    //         'USER-NAME',
    //         this._oauthService.getIdentityClaims()['name']
    //       );
    //     }
    //   });
  }

  private get userNameControl(): AbstractControl {
    return this.loginForm.get('username');
  }
}
