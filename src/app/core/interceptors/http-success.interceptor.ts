import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpResponseHandlerService } from '../services/http-response-handler.service';

@Injectable()
export class HttpSuccessInterceptor implements HttpInterceptor {
  constructor(
    private _httpResponseHandlerService: HttpResponseHandlerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((response) => {
        if (response instanceof HttpResponse) {
          if (
            this.isResponseStatusOk(response) &&
            this.isRequestMethodPostOrPut(request)
          ) {
            this._httpResponseHandlerService.manageSuccess();
          }
        }
      })
    );
  }

  private isResponseStatusOk(response: HttpResponse<unknown>) {
    return response.status === 200 || response.status === 201;
  }

  private isRequestMethodPostOrPut(request: HttpRequest<unknown>) {
    return request.method === 'POST' || request.method === 'PUT';
  }
}
