import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusable]'
})
export class FocusableDirective {
  constructor(private host: ElementRef) { }

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }
}
