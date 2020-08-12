import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Region } from '../../regions/models/region';

@Injectable({
  providedIn: 'root',
})
export class AirportRegionsService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportRegions(aiportId: string): Observable<Page<Region>> {
    const url: string = this.mocked
      ? '/assets/mocks/regions.json'
      : `${this.url}/${aiportId}/regions`;

    return this.httpClient.get<Page<Region>>(url);
  }
}
