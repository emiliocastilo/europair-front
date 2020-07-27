import { Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appMatCollapsible]',
})
export class MatCollapsibleDirective implements OnDestroy {
  private matCollapsibleInstance: M.Collapsible;

  constructor(elementRef: ElementRef) {
    this.matCollapsibleInstance = M.Collapsible.init(elementRef.nativeElement, {
      onCloseEnd: this.onCloseCallback,
      onOpenEnd: this.onOpenCallback,
    });
  }

  private onCloseCallback = (el: Element) => {
    const collapsibleIcon = el.getElementsByClassName('material-icons')[0];
    collapsibleIcon.innerHTML = 'keyboard_arrow_down';
  };

  private onOpenCallback = (el: Element) => {
    const collapsibleIcon = el.getElementsByClassName('material-icons')[0];
    collapsibleIcon.innerHTML = 'keyboard_arrow_up';
  };

  ngOnDestroy(): void {
    this.matCollapsibleInstance.destroy();
  }
}
