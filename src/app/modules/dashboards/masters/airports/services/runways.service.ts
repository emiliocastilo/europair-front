import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Track } from '../models/airport';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RunwaysService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportRunways(airportId: string): Observable<Page<Track>> {
    const url: string = this.mocked
      ? '/assets/mocks/runways.json'
      : `${this.url}/${airportId}/runways`;

    return this.httpClient.get<Page<Track>>(url);
  }

  public addTrack(airportId: string, track: Track): Observable<Track> {
    if (this.mocked) {
      track.id = Math.floor(1000);
      return of(track);
    } else {
      return this.httpClient.post<Track>(`${this.url}/${airportId}/runways`, track);
    }
  }

  public editTrack(airportId: string, track: Track): Observable<Track> {
    if (this.mocked) {
      return of(track);
    } else {
      return this.httpClient.put<Track>(`${this.url}/${airportId}/runways/${track.id}`, track);
    }
  }

  public deleteTrack(airportId: string, track: Track): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${airportId}/runways/${track.id}`);
  }
}
