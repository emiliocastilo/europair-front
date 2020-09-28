import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../models/airport';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';

@Injectable({
  providedIn: 'root',
})
export class AirportsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}airports`;
  private readonly filterOptions: FilterOptions = {
    filter_iataCode: OperatorEnum.CONTAINS,
    filter_icaoCode: OperatorEnum.CONTAINS,
    filter_name: OperatorEnum.CONTAINS,
    'filter_city.name': OperatorEnum.CONTAINS,
    'filter_country.name': OperatorEnum.CONTAINS,
    'filter_country.id': OperatorEnum.EQUALS,
    filter_removedAt: OperatorEnum.IS_NULL,
    search: OperatorEnum.CONTAINS,
    size: OperatorEnum.EMPTY
    } as const;

  constructor(private readonly httpClient: HttpClient, private searchFilterService: SearchFilterService) { }

  public getAirports(searchFilter: SearchFilter = {}): Observable<Page<Airport>> {
    const url: string = this.mocked ? '/assets/mocks/airports.json' : this.url;
    return this.httpClient.get<Page<Airport>>(url, { 
      params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions) 
    });
  }

  public addAirport(airport: Airport): Observable<Airport> {
    if (this.mocked) {
      airport.id = Math.floor(Math.random() * 100);
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

  public getAirport(airportId: number): Observable<Airport> {
    const url: string = this.mocked ? '/assets/mocks/airport.json' : `${this.url}/${airportId}`;
    return this.httpClient.get<Airport>(url);
  }
}
