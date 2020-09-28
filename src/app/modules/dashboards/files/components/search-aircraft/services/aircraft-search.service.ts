import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AircraftFilter } from '../models/aircraft-filter.model';
import { AircraftSearchResult } from '../models/aircraft-search.model';

@Injectable({
  providedIn: 'root',
})
export class AircraftSearchService {

  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}aircraft-search`;

  constructor( private readonly httpClient: HttpClient ) { }

  public searchAircraft(searchParams: AircraftFilter): Observable<Array<AircraftSearchResult>> {
    const url: string = this.mocked ? '/assets/mocks/aircraft-search.json' : this.url;
    return this.httpClient.get<Array<AircraftSearchResult>>(url, {params: searchParams.getHttpParams()});
  }
}
