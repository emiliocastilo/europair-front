import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City, SaveCity, Country } from '../models/city';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private readonly mocked: boolean = true;
  constructor(private readonly httpClient: HttpClient) { }

  public getCities(): Observable<City[]> {
    let url: string;
    if (this.mocked) {
      url = '/assets/mocks/cities.json';
    } else {
      url += `${environment.apiUrl}city`;
    }
    return this.httpClient.get<City[]>(url);
  }

  public addCity(city: SaveCity): Observable<City[]> {
    const url: string = `${environment.apiUrl}city`;
    const param: City = {
      code: city.code,
      name: city.name,
      country: {
        code: city.country.code
      }
    };
    return this.httpClient.post<City[]>(url, param);
  }

  public editCity(city: SaveCity): Observable<City[]> {
    const url: string = `${environment.apiUrl}city/code=${city.code}`;
    const param: City = {
      name: city.name,
      code: city.code,
      country: city.country
    };
    return this.httpClient.put<City[]>(url, param);
  }

  public deleteCity(city: City): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}city/code=${city.code}`);
  }

  // TODO: usar countriesService cuando esté integrado (cambiar tambien el modelo)
  public getCountries(): Observable<Country[]> {
    const url: string = '/assets/mocks/countries.json';
    return this.httpClient.get<Country[]>(url);
  }
}
