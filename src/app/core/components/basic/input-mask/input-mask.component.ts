import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMaskComponent),
      multi: true,
    },
  ],
})
export class InputMaskComponent implements OnInit, ControlValueAccessor {
  @Input() prefix = '';
  @Input() type = 'text';
  @Input() hasErrors: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() maskPatterns: {
    [character: string]: { pattern: RegExp; optional?: boolean };
  };
  @Input() mask: string;
  @Input() maskValidation: boolean = false;
  @Input() cssClasses: string;

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
    this.value = '';
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
      this.value = value || '';
      this.counter = value.length;
    } else {
      this.value = '';
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
