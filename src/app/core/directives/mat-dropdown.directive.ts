import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appMatDropdown]',
})
export class MatDropdownDirective implements OnDestroy {
  private matDropdownInstance: M.Dropdown;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.matDropdownInstance = M.Dropdown.init(
      this.elementRef.nativeElement,
      {}
    );
  }

  ngOnDestroy(): void {
    this.matDropdownInstance.destroy();
  }
}
