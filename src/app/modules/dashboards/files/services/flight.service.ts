import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Flight, FlightOrder } from '../models/Flight.model';

@Injectable({
  providedIn: 'root',
})

export class FlightService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}files/`;
  private readonly filterOptions: FilterOptions = {
    'filter_route.routeState': OperatorEnum.EQUALS
  } as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getFlightsByFile(fileId: number, searchFilter: SearchFilter = {}): Observable<Page<Flight>> {
    const url: string = this.mocked
      ? '/assets/mocks/fileRoutes.json'
      : `${this.url}${fileId}/flights`;
    return this.http.get<Page<Flight>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

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

  public createFlight(fileId: number, routeId: number, flight: Flight): Observable<Flight> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights`;
    return this.http.post<Flight>(url, flight);
  }

  public updateFlight(fileId: number, routeId: number, flight: Flight): Observable<Flight> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights/${flight.id}`;
    return this.http.put<Flight>(url, flight);
  }

  public deleteFlight(fileId: number, routeId: number, flight: Flight): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights/${flight.id}`;
    return this.http.delete<void>(url);
  }

  public reorderFlights(fileId: number, routeId: number, flightsOrder: FlightOrder[]): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/flights/reorder`;
    return this.http.put<void>(url, flightsOrder);
  }
}
