import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SESSION_STORAGE_KEYS } from '../models/session-storage-keys';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  private readonly EXTERNAL_URL = 'external';
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.AUTH_TOKEN);

    if (token && this.isApiRequest(request)) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
        url: this.createExternalUrl(request.url),
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }

  private createExternalUrl(url: string): string {
    return `${url.slice(0, environment.apiUrl.length)}external/${url.slice(
      environment.apiUrl.length
    )}`;
  }

  private isApiRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes(environment.apiUrl);
  }
}
