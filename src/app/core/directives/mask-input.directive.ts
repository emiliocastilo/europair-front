import { Directive, ElementRef, Input, HostListener } from '@angular/core';

export enum MaskType {
  TWO_CHAR_UPPER_CASE = 'twoCharUpperCase'
}
@Directive({
  selector: '[appMaskInput]',
})
export class MaskInputDirective {
  @Input() mask: MaskType;

  private readonly twoCharUpperCaseRegex: RegExp = new RegExp(/^[A-Z]{2}$/i);
  private readonly specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'Left', 'Right', 'Del'];

  constructor(private readonly elementRef: ElementRef) { }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    let initValue: string = this.elementRef.nativeElement.value;
    if (this.mask && initValue && this.mask === MaskType.TWO_CHAR_UPPER_CASE) {
      initValue = initValue.toUpperCase();
      if (initValue.match(this.twoCharUpperCaseRegex) && !this.specialKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent) {
    const initValue: string = this.elementRef.nativeElement.value;
    if (this.mask && initValue && this.mask === MaskType.TWO_CHAR_UPPER_CASE) {
      this.elementRef.nativeElement.value = initValue.toUpperCase();
    }
  }
}
