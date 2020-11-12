import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHeaderSticky]'
})
export class HeaderStickyDirective {
  @Input() private scrollToStiky: number = 140;
  @Input() private stickyDelay: number = 40;
  constructor() { }
  @HostBinding('class.button-panel-fixed') isScrolled: boolean;

  @HostListener('window:scroll', ['$event.currentTarget.pageYOffset'])
  onScroll(position: number): void {
    const transitionScroll: number = this.isScrolled ?
      (this.scrollToStiky - this.stickyDelay) : (this.scrollToStiky + this.stickyDelay);
    this.isScrolled = position > transitionScroll;
  }
}
