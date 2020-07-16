import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { City, Pageable } from '../models/city';
=======
import { City, Country } from '../models/city';
>>>>>>> #159605 Añadimos id para gestion
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}cities`;

  constructor(private readonly httpClient: HttpClient) { }

  public getCities(): Observable<Pageable<City>> {
    const url: string = this.mocked ? '/assets/mocks/cities.json' : this.url;
    return this.httpClient.get<Pageable<City>>(url);
  }

  public addCity(city: City): Observable<City> {
    return this.httpClient.post<City>(this.url, city);
  }

  public editCity(city: City): Observable<City> {
    return this.httpClient.put<City>(`${this.url}/${city.id}`, city);
  }

  public deleteCity(city: City): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${city.id}`);
  }
}
