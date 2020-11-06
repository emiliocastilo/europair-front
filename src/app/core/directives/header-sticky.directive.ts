import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHeaderSticky]'
})
export class HeaderStickyDirective {
  private scrollToStiky: number = 200;
  constructor() { }
  @HostBinding('class.button-panel-fixed') isScrolled: boolean;

  @HostListener('window:scroll', ['$event.currentTarget.pageYOffset'])
  onScroll(position: number): void {
    this.isScrolled = position > this.scrollToStiky;
  }
}
