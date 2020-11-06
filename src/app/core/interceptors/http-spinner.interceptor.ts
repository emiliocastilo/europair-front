import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class HttpSpinnerInterceptor implements HttpInterceptor {
  constructor(private readonly spinnerService: SpinnerService) { }

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
    this.spinnerService.show();
    return next.handle(request).pipe(finalize(() => this.spinnerService.hide()));
  }
}
