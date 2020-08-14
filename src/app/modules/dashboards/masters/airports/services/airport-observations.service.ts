import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Observation } from '../models/airport';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AirportObservationsService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportObservations(
    aiportId: string
  ): Observable<Page<Observation>> {
    const url: string = this.mocked
      ? '/assets/mocks/airport-observations.json'
      : `${this.url}/${aiportId}/observations`;

    return this.httpClient.get<Page<Observation>>(url);
  }
}
