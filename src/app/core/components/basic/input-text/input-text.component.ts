import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTextIcon, InputTextIconPositions } from 'src/app/core/models/basic/input-text/input-text-icon';
import { fromEvent, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { isString } from 'util';

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
export class InputTextComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef
  @Input() id: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() type: string = 'text';
  @Input() hasErrors: boolean;
  @Input() iconConfig: InputTextIcon;
  @Input() clearable: boolean = false;
  @Output() onSearchChanged: EventEmitter<string> = new EventEmitter();

  public ICON_POSITION = InputTextIconPositions;
  public value: string = '';
  public isDisabled: boolean;
  public onChange = (_: any) => {};
  public onTouch = () => {};
  private unsubscriber$: Subject<void> = new Subject();

  constructor() {}

  ngOnInit(): void {
    const terms$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
    .pipe(
      map(event => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.unsubscriber$)
    );
   terms$
    .subscribe(
      criterion => {
        this.onSearchChanged.emit(criterion);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  public clearInput(): void {
    this.value = '';
    this.onTouch();
    this.onChange(this.value);
    this.onSearchChanged.emit('');
  }

  public onInput(value: string): void {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }

  public hasInputContent(): boolean {
    return isString(this.value) && this.value.length > 0
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
