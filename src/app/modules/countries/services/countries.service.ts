import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, SaveCountry } from '../models/country';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly mocked: boolean = true;
  constructor(private readonly httpClient: HttpClient) { }

  public getCountries(): Observable<Country[]> {
    let url: string;
    if (this.mocked) {
      url = '/assets/mocks/countries.json';
    } else {
      url += `${environment.apiUrl}country`;
    }
    return this.httpClient.get<Country[]>(url);
  }

  public addCountry(country: SaveCountry): Observable<Country[]> {
    const url: string = `${environment.apiUrl}country`;
    const param: Country = {
      code: country.code, name: country.name
    };
    return this.httpClient.post<Country[]>(url, param);
  }

  public editCountry(country: SaveCountry): Observable<Country[]> {
    const url: string = `${environment.apiUrl}country/${country.oldCode}`;
    const param: Country = {
      code: country.code,
      name: country.name
    };
    return this.httpClient.put<Country[]>(url, param);
  }

  public deleteCountry(country: Country): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}country/${country.code}`);
  }
}
