import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AircraftBase } from '../../../../models/Aircraft.model';
import { AirportsService } from 'src/app/modules/dashboards/masters/airports/services/airports.service';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { Page } from 'src/app/core/models/table/pagination/page';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-base-detail',
  templateUrl: './base-detail.component.html',
  styleUrls: ['./base-detail.component.scss'],
})
export class BaseDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public baseForm: FormGroup;
  @Input()
  public enabledAircraftBase: boolean;
  @Input()
  public aircraftBase: AircraftBase;
  @Input()
  public modeEdit: boolean = false;

  @Output()
  public saveBase = new EventEmitter<AircraftBase>();

  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;

  constructor(private airportsService: AirportsService) {}

  ngOnInit(): void {
    this.loadAirports();
  }

  private loadAirports(): void {
    this.airports$ = concat(
      of([]), // default items
      this.airportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.airportsLoading = true)),
        switchMap((term: string): Observable<Airport[]> =>
          this.airportsService.searchAirports(term).pipe(
            map((page: Page<Airport>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.airportsLoading = false)))
        )
      )
    );
  }

  public onSaveBase() {
    const airport: Airport = this.baseForm.get('airport').value;
    const mainBase: boolean = this.baseForm.get('mainBase').value;
    this.saveBase.next({
      id: this.modeEdit ? this.aircraftBase.id : null,
      airport,
      mainBase
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.baseForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.baseForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public onChangeMainBase(selected: {id: string, value: boolean}): void {
    this.baseForm.get('mainBase').setValue(selected.value);
  }

  public getMainBaseValue(): boolean {
    return !!this.baseForm.get('mainBase').value;
  }

  public disabledMainBase(): boolean {
    return !this.enabledAircraftBase && (!this.aircraftBase || !this.aircraftBase.mainBase);
  }
}
