import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpResponseHandlerService } from '../services/http-response-handler.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private _httpResponseHandlerService: HttpResponseHandlerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error', error);
        } else {
          console.log('this is server side error', error);
          this._httpResponseHandlerService.manageError(error);
        }
        return throwError(error);
      })
    );
  }
}
