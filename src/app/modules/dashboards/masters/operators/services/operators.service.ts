import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Operator } from '../models/Operator.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperatorsService {
  private readonly url = `${environment.apiUrl}operators`;
  constructor(private http: HttpClient) {}

  public getOperators(): Observable<Page<Operator>> {
    return this.http.get<Page<Operator>>(this.url);
  }

  public saveOperator(operator: Operator): Observable<Operator> {
    return operator.id
      ? this.updateOperator(operator)
      : this.createOperator(operator);
  }

  private createOperator(operator: Operator): Observable<Operator> {
    return this.http.post<Operator>(this.url, operator);
  }

  private updateOperator(operator: Operator): Observable<Operator> {
    const updateOperatorUrl = `${this.url}/${operator.id}`;
    return this.http.put<Operator>(updateOperatorUrl, operator);
  }

  public removeOperator(operator: Operator) {
    const removeOperatorUrl = `${this.url}/${operator.id}`;
    return this.http.delete(removeOperatorUrl);
  }
}
