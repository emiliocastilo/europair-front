import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Terminal } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class TerminalsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportTerminals(aiportId: string): Observable<Page<Terminal>> {
    const url: string = this.mocked
      ? '/assets/mocks/terminals.json'
      : `${this.url}/${aiportId}/terminals`;

    return this.httpClient.get<Page<Terminal>>(url);
  }

  public addTerminal(airportId: string, terminal: Terminal): Observable<Terminal> {
    if (this.mocked) {
      terminal.id = Math.floor(Math.random() * 100);
      return of(terminal);
    } else {
      return this.httpClient.post<Terminal>(`${this.url}/${airportId}/terminals`, terminal);
    }
  }

  public editTerminal(airportId: string, terminal: Terminal): Observable<Terminal> {
    if (this.mocked) {
      return of(terminal);
    } else {
      return this.httpClient.put<Terminal>(`${this.url}/${airportId}/terminals/${terminal.id}`, terminal);
    }
  }

  public deleteTerminal(airportId: string, terminal: Terminal): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${airportId}/terminals/${terminal.id}`);
  }
}
