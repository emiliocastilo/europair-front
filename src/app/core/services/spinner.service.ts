import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _visibility: BehaviorSubject<boolean>;

  constructor() {
    this._visibility = new BehaviorSubject(false);
  }

  public getVisibility$(): Observable<boolean> {
    return this._visibility.asObservable().pipe(debounceTime(200), delay(0));
  }

  public show(): void {
    this._visibility.next(true);
  }

  public hide(): void {
    this._visibility.next(false);
  }
}
