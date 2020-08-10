import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';

@Component({
  selector: 'app-airport-detail',
  templateUrl: './airport-detail.component.html',
  styleUrls: ['./airport-detail.component.scss'],
})
export class AirportDetailComponent implements OnInit, OnDestroy {
  private unsubscriber$: Subject<void> = new Subject();
  public routeData$: Observable<Data>;
  private readonly newAirportBarButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Crear aeropuerto' },
  ];
  private readonly editAirportBarButtons: BarButton[] = [
    { type: BarButtonType.EDIT, text: 'Guardar aeropuerto' },
    { type: BarButtonType.DELETE, text: 'Eliminar aeropuerto' },
  ];
  public barButtons: BarButton[];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.routeData$ = this.route.data.pipe(tap(this.initButtonBar));
    this.route.params
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(console.log);
  }

  private initButtonBar = ({ isAirportDetail }): void => {
    this.barButtons = isAirportDetail
      ? this.editAirportBarButtons
      : this.newAirportBarButtons;
  };

  private newAirport = () => {
    this.router.navigate(['airports/1']);
  };

  private editAirport = () => {
    console.log('EDITING AIRPORT');
  };

  private barButtonActions = {
    new: this.newAirport,
    edit: this.editAirport,
    delete: () => {},
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    console.log('onBarButtonClicked', barButtonType);
    this.barButtonActions[barButtonType]();
  }

  public onGeneralDataChanged(generalData: any) {
    console.log('onGeneralDataChanged', generalData);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
