import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { MenuModel } from '../models/menus/left-sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient) { }

  public getMenu(): Observable<MenuModel> {
    const url = environment.apiUrl + 'v1/menu/1';
    return this.httpClient.get<MenuModel>(url);
  }
}
