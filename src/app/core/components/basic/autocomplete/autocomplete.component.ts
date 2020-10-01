import { coerceNumberProperty } from '@angular/cdk/coercion';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidatorFn,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent
  implements OnInit, ControlValueAccessor, OnChanges {
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() prefix = '';
  @Input() type = 'text';
  @Input() placeHolder = '';
  @Input() visible = true;
  @Input() selectable = true;
  @Input() optionLabel = '';
  @Input() optionValue = '';
  @Input() removable = true;

  @Input() options: any[] = [];

  @Input()
  set lengthToTriggerSearch(value: number) {
    this._lengthToTriggerSearch = coerceNumberProperty(value, 0);
  }

  noResults = false;
  isSearching = false;

  private _lengthToTriggerSearch = 3;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputControl = new FormControl('', this.validators);
  filteredObjects: Observable<string[]>;
  selectedItems: any[] = [];

  constructor(
    @Optional() @Self() private controlDir: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (this.controlDir != null) {
      this.controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.controlDir) {
      // Set validators for the outer ngControl equals to the inner
      const control = this.controlDir.control;
      const validators = control.validator
        ? [control.validator, this.inputControl.validator]
        : this.inputControl.validator;
      control.setValidators(validators);
      // Update outer ngControl status
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      if (this.isSearching) {
        console.log(changes);
        this.isSearching = false;
        if (!changes.options.firstChange && !changes.options.currentValue) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      }
    }
  }

  /**
   * Allows Angular to update the inputControl.
   * Update the model and changes needed for the view here.
   */
  writeValue(obj: any): void {
    if (obj) {
      this.inputControl.setValue(obj);
    } else {
      this.inputControl.setValue('');
    }
  }

  /**
   * Allows Angular to register a function to call when the inputControl changes.
   */
  registerOnChange(fn: any): void {
    // Pass the value to the outer ngControl if it has an id otherwise pass null
    this.inputControl.valueChanges.subscribe({
      next: (value) => {
        if (typeof value === 'string') {
          if (this.isMinLength(value)) {
            this.isSearching = true;
            this.changeDetectorRef.detectChanges();
            fn(value);
          } else {
            this.isSearching = false;
            this.noResults = false;
            fn('');
          }
        } else {
          fn(value);
        }
      },
    });
  }

  /**
   * Allows Angular to register a function to call when the input has been touched.
   * Save the function as a property to call later here.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Allows Angular to disable the input.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
  }

  /**
   * Function to call when the input is touched.
   */
  onTouched() {}

  /**
   * Method linked to the mat-autocomplete `[displayWith]` input.
   * This is how result name is printed in the input box.
   */
  displayFn(result: any): any {
    return result ? result : undefined;
  }

  isMinLength(value: string) {
    return value.length >= this._lengthToTriggerSearch;
  }

  private get validators(): ValidatorFn[] {
    return [];
  }
}
