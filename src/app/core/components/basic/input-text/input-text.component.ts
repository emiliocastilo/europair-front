import { Component, OnInit, Input, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskType } from 'src/app/core/directives/mask-input.directive';

@Component({
  selector: 'core-basic-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent implements OnInit, ControlValueAccessor {
  @Input() id: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() type: string = 'text';
  @Input() hasErrors: boolean;
  @Input() mask: MaskType;

  public value: string = '';
  public isDisabled: boolean;
  public onChange = (_: any) => {};
  public onTouch = () => {};

  constructor() {}

  ngOnInit(): void {}

  public onInput(value: string) {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
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
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
