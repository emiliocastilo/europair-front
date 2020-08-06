import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Track } from '../models/airport';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RunwaysService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportRunways(aiportId: string): Observable<Page<Track>> {
    const url: string = this.mocked
      ? '/assets/mocks/runways.json'
      : `${this.url}/${aiportId}/runways`;

    return this.httpClient.get<Page<Track>>(url);
  }
}
