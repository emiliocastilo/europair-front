import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  public onLogin() {
    this._authService
      .login({ username: 'prueba', password: 'prueba' })
      .subscribe(this.setTokenOnSessionStorage);
  }

  private setTokenOnSessionStorage = (response) => {
    sessionStorage.setItem('AUTH-TOKEN', response.token);
    this._router.navigate(['/tasks']);
  };
}
