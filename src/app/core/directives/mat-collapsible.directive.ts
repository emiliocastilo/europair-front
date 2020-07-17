import { Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appMatCollapsible]',
})
export class MatCollapsibleDirective implements OnDestroy {
  private matCollapsibleInstance: M.Collapsible;

  constructor(elementRef: ElementRef) {
    this.matCollapsibleInstance = M.Collapsible.init(elementRef.nativeElement, {
      accordion: false,
    });
  }

  ngOnDestroy(): void {
    this.matCollapsibleInstance.destroy();
  }
}
