import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { City } from 'src/app/modules/dashboards/masters/cities/models/city';
import { Aircraft } from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';
import { environment } from 'src/environments/environment';
import { AircraftSearch } from '../models/aircraft-search.model';

@Injectable({
  providedIn: 'root',
})
export class AircraftSearchService {

  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}aircraft-search`;

  constructor(private readonly httpClient: HttpClient) { }

  public searchAircraft(searchParams: AircraftSearch): Observable<Page<Aircraft>> {
    const url: string = this.mocked ? '/assets/mocks/aircraft.json' : this.url;
    return this.httpClient.get<Page<Aircraft>>(url, {params: searchParams.getHttpParams()});
  }
}
