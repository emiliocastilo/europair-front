import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'core-table-column-checkbox',
  templateUrl: './column-checkbox.component.html',
  styleUrls: ['./column-checkbox.component.scss'],
})
export class ColumnCheckboxComponent implements OnInit {
  @Input() id: string;
  @Input() link: string;
  @Input() label: string;
  @Input() value: string;
  @Input() checked: boolean;
  @Output() selectedValueEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  emitSelectedValueEvent() {
    this.selectedValueEvent.emit({
      id: this.id,
      value: this.value,
    });
  }
}
