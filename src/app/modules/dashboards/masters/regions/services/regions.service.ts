import { Injectable } from '@angular/core';
import { Region } from '../models/region';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Airport } from '../models/airport';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  constructor(private http: HttpClient) {}

  public getRegions(): Observable<Page<Region>> {
    return this.http.get<Page<Region>>('/assets/mocks/regions.json');
  }

  public getAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>('/assets/mocks/airports.json');
  }
}
