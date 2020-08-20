import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Observation } from '../models/airport';
import { HttpClient } from '@angular/common/http';
import { env } from 'process';

@Injectable({
  providedIn: 'root',
})
export class AirportObservationsService {
  private readonly mocked: boolean = environment.mock;
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

  public addObservation(airportId: string, observation: Observation): Observable<Observation> {
    if (this.mocked) {
      observation.id = Math.floor(1000);
      return of(observation);
    } else {
      return this.httpClient.post<Observation>(`${this.url}/${airportId}/observations`, observation);
    }
  }

  public editObservation(airportId: string, observation: Observation): Observable<Observation> {
    if (this.mocked) {
      return of(observation);
    } else {
      return this.httpClient.put<Observation>(`${this.url}/${airportId}/observations/${observation.id}`, observation);
    }
  }

  public deleteObservation(airportId: string, observation: Observation): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${airportId}/observations/${observation.id}`);
  }
}
