import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
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
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo aeropuerto' },
    { type: BarButtonType.DELETE, text: 'Eliminar aeropuerto' },
  ];

  constructor(private route: ActivatedRoute) {
    this.routeData$ = this.route.data;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(console.log);
  }

  public onBarButtonClicked(event) {
    console.log('onBarButtonClicked', event);
  }

  public onGeneralDataChanged(generalData: any) {
    console.log('onGeneralDataChanged', generalData);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
