import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';

@Component({
  selector: 'core-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss'],
})
export class ButtonBarComponent implements OnInit {
  @Input()
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva tarea' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  @Input()
  public itemsSelectedCount: number = 0;

  @Output()
  public executeAction: EventEmitter<BarButtonType> = new EventEmitter();

  BAR_BUTTON_TYPE = BarButtonType;
  constructor() {}

  public onBarButtonClicked(type: BarButtonType) {
    this.executeAction.next(type);
  }

  ngOnInit(): void {}
}
