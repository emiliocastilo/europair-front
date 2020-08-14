import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  Operator,
  Certification,
  OperatorComment,
} from '../models/Operator.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperatorsService {
  private readonly url = `${environment.apiUrl}operators`;
  constructor(private http: HttpClient) {}

  public searchOperator(
    text: string = '',
    pageable: any
  ): Observable<Page<Operator>> {
    const params = new HttpParams();
    params.set('text', text);
    params.set('pageable', String(pageable));

    const searchOperatorUrl = `${this.url}/search`;
    return this.http.get<Page<Operator>>(searchOperatorUrl, { params });
  }

  public getOperators(): Observable<Page<Operator>> {
    return this.http.get<Page<Operator>>(this.url);
  }

  public getOperatorById(operatorId: number): Observable<Operator> {
    const getOperatorUrl = `${this.url}/${operatorId}`;
    return this.http.get<Operator>(getOperatorUrl);
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

  public getOperatorCertifications(
    operatorId: number
  ): Observable<Page<Certification>> {
    const getOperatorCertifications = `${this.url}/${operatorId}/certifications`;
    return this.http.get<Page<Certification>>(getOperatorCertifications);
  }

  public getOperatorCertificationsByYd(
    operatorId: number,
    certificationId: number
  ): Observable<Certification> {
    const getOperatorCertificationsById = `${this.url}/${operatorId}/certifications/${certificationId}`;
    return this.http.get<Certification>(getOperatorCertificationsById);
  }

  public saveCertification(
    operatorId: number,
    certification: Certification
  ): Observable<Certification> {
    return certification.id
      ? this.updateCertification(operatorId, certification)
      : this.createCertification(operatorId, certification);
  }

  private createCertification(
    operatorId: number,
    certification: Certification
  ): Observable<Certification> {
    const createCertificationUrl = `${this.url}/${operatorId}/certifications`;
    return this.http.post<Certification>(createCertificationUrl, certification);
  }

  private updateCertification(
    operatorId: number,
    certification: Certification
  ): Observable<Certification> {
    const updateCertificationUrl = `${this.url}/${operatorId}/certifications/${certification.id}`;
    return this.http.put<Certification>(updateCertificationUrl, certification);
  }

  public removeCertification(operatorId: number, certificationId: number) {
    const removeCertificationUrl = `${this.url}/${operatorId}/certifications/${certificationId}`;
    return this.http.delete(removeCertificationUrl);
  }

  public getOperatorComments(
    operatorId: number
  ): Observable<Page<OperatorComment>> {
    const getOperatorOperatorCommentsUrl = `${this.url}/${operatorId}/comments`;
    return this.http.get<Page<OperatorComment>>(getOperatorOperatorCommentsUrl);
  }

  public getOperatorCommentsByYd(
    operatorId: number,
    commentId: number
  ): Observable<OperatorComment> {
    const getOperatorOperatorCommentsById = `${this.url}/${operatorId}/comments/${commentId}`;
    return this.http.get<OperatorComment>(getOperatorOperatorCommentsById);
  }

  public saveOperatorComment(
    operatorId: number,
    certification: OperatorComment
  ): Observable<OperatorComment> {
    return certification.id
      ? this.updateOperatorComment(operatorId, certification)
      : this.createOperatorComment(operatorId, certification);
  }

  private createOperatorComment(
    operatorId: number,
    certification: OperatorComment
  ): Observable<OperatorComment> {
    const createOperatorCommentUrl = `${this.url}/${operatorId}/comments`;
    return this.http.post<OperatorComment>(
      createOperatorCommentUrl,
      certification
    );
  }

  private updateOperatorComment(
    operatorId: number,
    certification: OperatorComment
  ): Observable<OperatorComment> {
    const updateOperatorCommentUrl = `${this.url}/${operatorId}/comments/${certification.id}`;
    return this.http.put<OperatorComment>(
      updateOperatorCommentUrl,
      certification
    );
  }

  public removeOperatorComment(operatorId: number, commentId: number) {
    const removeOperatorCommentUrl = `${this.url}/${operatorId}/comments/${commentId}`;
    return this.http.delete(removeOperatorCommentUrl);
  }
}
