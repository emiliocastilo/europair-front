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
    { type: BarButtonType.NEW, text: 'Nuevo' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  @Input()
  public itemsSelectedCount: number = 0;
  @Input() goBackRoute: string;
  @Output()
  public executeAction: EventEmitter<BarButtonType> = new EventEmitter();
  public showButtonBar: boolean = true;

  BAR_BUTTON_TYPE = BarButtonType;
  constructor() {}

  ngOnInit(): void {}

  public onBarButtonClicked(type: BarButtonType) {
    this.executeAction.next(type);
  }
}
