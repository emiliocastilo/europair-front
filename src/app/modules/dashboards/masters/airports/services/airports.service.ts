import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class AirportsService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private readonly httpClient: HttpClient) { }
  public getAirports(showDisabled: boolean, filter?: string): Observable<Page<Airport>> {
    const url: string = this.mocked ? '/assets/mocks/airports.json' : this.url;
    let params: HttpParams = new HttpParams();
    params = params.set('showDisabled', String(showDisabled));
    if (filter) {
      params = params.set('search', filter);
    }
    return this.httpClient.get<Page<Airport>>(url, {params});
  }

  public addAirport(airport: Airport): Observable<Airport> {
    if (this.mocked) {
      airport.id = Math.floor(1000);
      return of(airport);
    } else {
      return this.httpClient.post<Airport>(this.url, airport);
    }
  }

  public editAirport(airport: Airport): Observable<Airport> {
    if (this.mocked) {
      return of(airport);
    } else {
      return this.httpClient.put<Airport>(`${this.url}/${airport.id}`, airport);
    }
  }

  public deleteAirport(airport: Airport): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${airport.id}`);
  }

  public disableAirport(airport: Airport): Observable<Airport> {
    return this.httpClient.put<Airport>(`${this.url}/disable`, airport);
  }
}
