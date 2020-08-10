import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Terminal } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class TerminalsService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportTerminals(aiportId: string): Observable<Page<Terminal>> {
    const url: string = this.mocked
      ? '/assets/mocks/terminals.json'
      : `${this.url}/${aiportId}/terminals`;

    return this.httpClient.get<Page<Terminal>>(url);
  }
}
