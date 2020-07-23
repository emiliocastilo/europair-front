import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {}

  public onLogin() {
    console.log(this.loginForm.value);
    this._authService
      .login(this.loginForm.value)
      .subscribe(this.setTokenOnSessionStorage);
  }

  private setTokenOnSessionStorage = (response) => {
    sessionStorage.setItem('AUTH-TOKEN', response.jwtToken);
    sessionStorage.setItem('USER-NAME', this.userNameControl.value);
    this._router.navigate(['/tasks']);
  };

  private get userNameControl(): AbstractControl {
    return this.loginForm.get('username');
  }
}
