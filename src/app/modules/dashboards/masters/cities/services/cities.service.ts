import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilter, FilterOptions } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private readonly mocked: boolean = false;
  private readonly url = `${environment.apiUrl}cities`;
  private readonly filterOptions: FilterOptions = { filter_name: OperatorEnum.CONTAINS } as const;

  constructor(private readonly httpClient: HttpClient, private searchFilterService: SearchFilterService) { }

  public getCities(searchFilter: SearchFilter = {}): Observable<Page<City>> {
    const url: string = this.mocked ? '/assets/mocks/cities.json' : this.url;
    return this.httpClient.get<Page<City>>(url, {
      params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions),
    });
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
