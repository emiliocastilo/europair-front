import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

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
  @Input() public itemValue: string;
  @Input() public itemDescription: string = 'name';
  @Input() public placeholder: string;
  @Input() public isDisabled: boolean;
  @Input() public hasErrors: boolean;
  @Input() public searchable: boolean;
  @Input() public loading: boolean;
  @Input() public tag: boolean;
  @Input() public multiple: boolean;
  @Input() public items: Array<any>;
  @Input() public typeahead: Subject<string>;
  @Input() public typeToSearchText: string = 'Type to search';
  @Input() public minTermLength: number = 0;
  @Input() public notFoundText: string = 'No items found';
  @Input() public virtualScroll: boolean = false;

  @Output() selectedValueEvent: EventEmitter<any> = new EventEmitter();

  public value: any;
  public onChange = (_: any) => { };
  public onTouch = () => { };

  constructor() { }

  public changeSelect(selectValue: any) {
    this.value = selectValue;
    this.onTouch();
    this.onChange(this.value);
    this.selectedValueEvent.emit(this.value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    } else {
      this.value = undefined;
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
