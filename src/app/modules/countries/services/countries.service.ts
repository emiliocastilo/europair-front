import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Country, CountryPageable } from '../models/country';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly mocked: boolean = false;
  private readonly url = `${environment.apiUrl}countries`;

  constructor(private readonly httpClient: HttpClient) { }

  public getCountries(): Observable<CountryPageable> {
    const url: string = this.mocked ? '/assets/mocks/countries.json' : this.url;
    return this.httpClient.get<CountryPageable>(url);
  }

  public addCountry(country: Country): Observable<Country> {
    if (this.mocked) {
      country.id = Math.floor(1000);
      return of(country);
    } else {
      return this.httpClient.post<Country>(this.url, country);
    }
  }

  public editCountry(country: Country): Observable<Country> {
    if (this.mocked) {
      return of(country);
    } else {
      return this.httpClient.put<Country>(`${this.url}/${country.id}`, country);
    }
  }

  public deleteCountry(country: Country): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${country.id}`);
  }
}
