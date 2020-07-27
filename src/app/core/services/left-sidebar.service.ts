import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { LeftSideBarModel } from '../models/menus/left-sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class LeftSidebarService {

  constructor(private httpClient: HttpClient) { }

  public getMenu():Observable<LeftSideBarModel>{
    const url = environment.apiUrl + 'v1/menu/1';
    return this.httpClient.get<LeftSideBarModel>(url);
  }
}
