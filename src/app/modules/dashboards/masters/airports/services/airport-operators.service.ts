import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Certification } from '../../operators/models/Operator.model';

@Injectable({
  providedIn: 'root',
})
export class AirportOperatorsService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}airports`;

  constructor(private httpClient: HttpClient) {}

  public getAirportCertifiedOperators(
    aiportId: string
  ): Observable<Page<Certification>> {
    const url: string = this.mocked
      ? '/assets/mocks/airport-certified-operators.json'
      : `${this.url}/${aiportId}/certifications`;

    return this.httpClient.get<Page<Certification>>(url);
  }
}
