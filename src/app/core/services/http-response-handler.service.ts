import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatedSnackBarComponent } from '../components/snack-bar/translated-snack-bar/translated-snack-bar.component';
import { ErrorCodes, getErrorTranslationLabel } from '../models/error/error-codes';

@Injectable({
  providedIn: 'root',
})
export class HttpResponseHandlerService {
  constructor(private _snackBar: MatSnackBar) { }

  public manageError(error: HttpErrorResponse) {

    let errorMsg: string = error.error.message;
    let errorLabel = 'ERRORS.CODES.UNKNOWN_ERROR';;

    if (errorMsg.startsWith('[')) {
      let errorCode: string = errorMsg.slice(1, 4);
      let translationLabel = getErrorTranslationLabel(errorCode);
      if (translationLabel) {
        errorLabel = 'ERRORS.CODES.' + translationLabel;
      }
    }

    this._snackBar.openFromComponent(TranslatedSnackBarComponent, {
      duration: 5000,
      panelClass: ['ep-snackbar-error'],
      data: {
        message: errorLabel
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
