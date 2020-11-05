import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _visibility: BehaviorSubject<boolean>;
  private _spinnerPendingRequestStack: number;

  constructor() {
    this._visibility = new BehaviorSubject(false);
    this._spinnerPendingRequestStack = 0;
  }

  public getVisibility$(): Observable<boolean> {
    return this._visibility.asObservable().pipe(debounceTime(200), delay(0));
  }

  public show(): void {
    this.pushSpinnerStack();
    this._visibility.next(true);
  }

  public hide(): void {
    this.popSpinnerStack();
    if (!this.hasSpinnerPendingTasks()) {
      this._visibility.next(false);
    }
  }

  private pushSpinnerStack() {
    this._spinnerPendingRequestStack++;
  }

  private popSpinnerStack() {
    if (this.hasSpinnerPendingTasks()) {
      this._spinnerPendingRequestStack--;
    }
  }

  private hasSpinnerPendingTasks(): boolean {
    return this._spinnerPendingRequestStack > 0;
  }
}
