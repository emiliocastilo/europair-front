import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _httpClient: HttpClient) {}

  public login(userData: {
    username: string;
    password: string;
  }): Observable<any> {
    return this._httpClient.post(
      'https://run.mocky.io/v3/f7ea2067-b8b5-4a4e-aa32-80b52add2472',
      userData
    );
  }

  public closeSession() {
    sessionStorage.removeItem('AUTH-TOKEN');
  }
}
