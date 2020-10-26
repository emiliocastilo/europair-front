import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxlength]',
})
export class MaxlengthDirective {
  @Input('appMaxlength') limitTo: number;
  @HostListener('keypress', ['$event'])
  limitMaxlength(event: any) {
    event?.target?.value?.length === this.limitTo
      ? event.preventDefault()
      : null;
  }
}
