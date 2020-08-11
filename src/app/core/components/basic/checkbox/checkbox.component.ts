import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'core-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
  @Input() id: string;
  @Input() link: string;
  @Input() label: string;
  @Input() value: boolean;
  @Input() disabled = false;
  @Output() selectedValueEvent: EventEmitter<{id: string, value: boolean}> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  emitSelectedValueEvent() {
    this.selectedValueEvent.emit({
      id: this.id,
      value: this.value,
    });
  }
}
