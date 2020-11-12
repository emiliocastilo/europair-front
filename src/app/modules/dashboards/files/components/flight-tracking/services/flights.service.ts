import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Flight } from '../../../models/Flight.model';

@Injectable({
  providedIn: 'root',
})

export class FlightsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}flights`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getFlights(searchFilter: SearchFilter = {}): Observable<Page<Flight>> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : `${this.url}`;
    return this.http.get<Page<Flight>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getFlightById(flightId: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.url}/${flightId}`);
  }

  public createFlight(flight: Flight): Observable<void> {
    return this.http.post<void>(`${this.url}`, flight);
  }

  public updateFlight(flight: Flight): Observable<void> {
    return this.http.put<void>(`${this.url}/${flight.id}`, flight);
  }

  public deleteFlight(flight: Flight): Observable<void> {
    return this.http.delete<void>(`${this.url}/${flight.id}`);
  }
}
