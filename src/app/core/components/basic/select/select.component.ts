import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'core-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() public id: string;
  @Input() public label: string;
  @Input() public itemValue: string = 'id';
  @Input() public itemDescription: string = 'name';
  @Input() public placeholder: string;
  @Input() public isDisabled: boolean;
  @Input() public hasErrors: boolean;
  @Input() public searchable: boolean;
  @Input() public loading: boolean;
  @Input() public items: Array<any>;

  @Output() selectedValueEvent: EventEmitter<any> = new EventEmitter();

  public onChange = (_: any) => { };
  public onTouch = () => { };
  public value: any = '';

  constructor() { }

  public changeSelect(selectValue: any) {
    this.value = selectValue;
    this.onTouch();
    this.onChange(this.value);
    this.selectedValueEvent.emit(this.value);
  }


  public getItemValue(item: any): string {
    return String(item[this.itemValue]);
  }

  public getItemDescription(item: any): string {
    return String(item[this.itemDescription]);
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
