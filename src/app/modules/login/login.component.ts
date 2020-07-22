import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import {
  InputTextIcon,
  InputTextIconPositions,
} from 'src/app/core/models/basic/input-text/input-text-icon';

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
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      userName: [''],
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
      .login({ username: 'prueba', password: 'prueba' })
      .subscribe(this.setTokenOnSessionStorage);
  }

  private setTokenOnSessionStorage = (response) => {
    sessionStorage.setItem('AUTH-TOKEN', response.token);
    sessionStorage.setItem('USER-NAME', this.userNameControl.value);
    this._router.navigate(['/tasks']);
  };

  private get userNameControl(): AbstractControl {
    return this.loginForm.get('userName');
  }
}
