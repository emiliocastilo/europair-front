import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Input()
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  @Input()
  public itemsSelectedCount: number = 0;

  @Input()
  public showSearchField: boolean = true;

  @Output()
  public executeAction: EventEmitter<BarButtonType> = new EventEmitter();

  @Output()
  public executeSearch: EventEmitter<string> = new EventEmitter();

  @Output()
  public executeChangeCheck: EventEmitter<boolean> = new EventEmitter();

  public checked: boolean = false;

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
