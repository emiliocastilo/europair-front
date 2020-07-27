import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Country } from '../models/country';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly mocked: boolean = false;
  private readonly url = `${environment.apiUrl}countries`;

  constructor(private readonly httpClient: HttpClient) { }

  public getCountries(): Observable<Page<Country>> {
    const url: string = this.mocked ? '/assets/mocks/countries.json' : this.url;
    return this.httpClient.get<Page<Country>>(url);
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
