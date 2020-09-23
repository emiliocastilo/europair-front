import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Certification } from '../../operators/models/Operator.model';

@Injectable({
  providedIn: 'root',
})
export class AirportOperatorsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportCertifiedOperators(
    aiportId: string
  ): Observable<Page<Certification>> {
    const url: string = this.mocked
      ? '/assets/mocks/airport-certified-operators.json'
      : `${this.url}/${aiportId}/operators`;

    return this.httpClient.get<Page<Certification>>(url);
  }

  public addCertification(airportId: string, certification: Certification): Observable<Certification> {
    if (this.mocked) {
      certification.id = Math.floor(Math.random() * 100);
      return of(certification);
    } else {
      return this.httpClient.post<Certification>(`${this.url}/${airportId}/operators`, certification);
    }
  }

  public editCertification(airportId: string, certification: Certification): Observable<Certification> {
    if (this.mocked) {
      return of(certification);
    } else {
      return this.httpClient.put<Certification>(`${this.url}/${airportId}/operators/${certification.id}`, certification);
    }
  }

  public deleteCertification(airportId: string, certification: Certification): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${airportId}/operators/${certification.id}`);
  }
}
