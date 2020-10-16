import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() prefix = '';
  @Input() type = 'text';
  @Input() hasErrors: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() defaultValue: string = '';

  counter = 0;
  value: string;
  isDisabled: boolean;
  _control: NgControl;

  onChange = (_: any) => {};
  onTouch = () => {};

  constructor(private injector: Injector) {}

  ngOnInit() {
    this._control = this.injector.get(NgControl);
  }

  public clearInput(): void {
    this.value = this.defaultValue;
    console.log(this.value);
    this.onTouch();
    this.onChange(this.value);
  }

  onInput(value: string) {
    this.counter = value.length;
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value || this.defaultValue;
      this.counter = value.length;
    } else {
      this.value = this.defaultValue;
    }
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
