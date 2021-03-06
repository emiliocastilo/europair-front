import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'core-basic-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements OnInit {
  @Input() id: string;
  @Input() firstLabel: string;
  @Input() lastLabel: string;
  @Input() value: boolean;
  @Input() public isDisabled = false;
  @Output() changeSwitch: EventEmitter<boolean> = new EventEmitter();

  public onChange = (_: any) => {};
  public onTouch = () => {};

  constructor() {}

  ngOnInit(): void {}

  onInput(value: boolean) {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
    this.changeSwitch.next(value);
  }

  writeValue(value: boolean): void {
    this.value = value || false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
