import { Injectable } from '@angular/core';
import { Region } from '../models/region';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  constructor(private http: HttpClient) {}

  public getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(
      'http://localhost:4200/assets/mocks/regions.json'
    );
  }

  public getAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(
      'http://localhost:4200/assets/mocks/airports.json'
    );
  }
}
