import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatedSnackBarComponent } from '../components/snack-bar/translated-snack-bar/translated-snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class HttpResponseHandlerService {
  constructor(private _snackBar: MatSnackBar) {}

  public manageError(error: HttpErrorResponse) {
    this._snackBar.openFromComponent(TranslatedSnackBarComponent, {
      duration: 5000,
      panelClass: ['ep-snackbar-error'],
      data: {
        message: error.error.message,
      },
    });
  }

  public manageSuccess() {
    this._snackBar.openFromComponent(TranslatedSnackBarComponent, {
      duration: 2000,
      panelClass: ['ep-snackbar-success'],
      data: {
        message: 'COMMON.SUCCESSFUL_OPERATION',
      },
    });
  }
}
