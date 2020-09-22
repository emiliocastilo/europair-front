import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Flight } from '../models/Flight.model';

@Injectable({
  providedIn: 'root',
})

export class FlightService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}/files/`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getFlights(fileId: number, routeId: number, searchFilter: SearchFilter = {}): Observable<Page<Flight>> {
    const url: string = this.mocked
      ? '/assets/mocks/fileRoutes.json'
      : `${this.url}${fileId}/routes/${routeId}/flights`;
    return this.http.get<Page<Flight>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public saveFlight(fileId: number, routeId: number, flight: Flight): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights`;
    return this.http.post<void>(url, flight);
  }

  public updateFlight(fileId: number, routeId: number, flight: Flight): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights/${flight.id}`;
    return this.http.put<void>(url, flight);
  }

  public deleteFlight(fileId: number, routeId: number, flight: Flight): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights/${flight.id}`;
    return this.http.delete<void>(url);
  }
}
