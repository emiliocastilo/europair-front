import { Component, Input, Output, EventEmitter, AfterViewInit, forwardRef } from '@angular/core';
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
export class SelectComponent implements AfterViewInit, ControlValueAccessor {
  @Input() public id: string;
  @Input() public label: string;
  @Input() public items: Array<any>;
  @Input() public itemValue: string = 'id';
  @Input() public itemDescription: string = 'name';
  @Input() public placeholder: string;
  @Input() public isDisabled: boolean;
  @Input() public hasErrors: boolean;

  @Output() selectedValueEvent: EventEmitter<any> = new EventEmitter();

  public onChange = (_: any) => { };
  public onTouch = () => { };

  public value: any = '';

  constructor() { }

  ngAfterViewInit(): void {
    const elems: NodeListOf<HTMLSelectElement> = document.querySelectorAll('select');
    const init = M.FormSelect.init(elems);
  }

  public changeSelect(selectValue: string) {
    this.value = this.items.find(item => this.getItemValue(item) === selectValue);
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

  public getPlaceholder(): string {
    return this.placeholder ? this.placeholder : 'Selecciona una opción';
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
