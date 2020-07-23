import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.apiUrl}login`;

  constructor(private _httpClient: HttpClient, private _router: Router) {}

  public login(userData: {
    username: string;
    password: string;
  }): Observable<any> {
    return this._httpClient.post(this.url, userData);
  }

  public closeSession() {
    sessionStorage.removeItem('AUTH-TOKEN');
    this._router.navigate(['/login']);
  }
}
