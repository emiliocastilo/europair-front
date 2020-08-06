import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';

@Component({
  selector: 'fleet-types-top-bar',
  templateUrl: './fleet-types-top-bar.component.html',
  styleUrls: ['./fleet-types-top-bar.component.scss']
})
export class FleetTypesTopBarComponent implements OnInit {

  @Input()
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  @Input()
  public typesSelectedCount: number = 0;

  @Input()
  public typesSelected: boolean;

  @Output()
  public executeAction: EventEmitter<BarButtonType> = new EventEmitter();

  @Output()
  public executeSearch: EventEmitter<string> = new EventEmitter();

  @Output()
  public executeChangeCheck: EventEmitter<boolean> = new EventEmitter();

  public checked: boolean = true;

  BAR_BUTTON_TYPE = BarButtonType;

  constructor() { }

  ngOnInit(): void {
  }

  public onBarButtonClicked($event): void {
    this.executeAction.next($event);
  }

  public onSearch($event): void {
    this.executeSearch.next($event);
  }

  public onChangeCheck($event): void {
    this.executeChangeCheck.next($event?.value);
  }

}
