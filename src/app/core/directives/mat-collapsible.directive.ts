import { Directive, ElementRef, OnDestroy, Renderer2, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appMatCollapsible]',
})
export class MatCollapsibleDirective implements OnDestroy, OnInit {
  @Input('appMatCollapsible')
  public initialState: { state: 'open' | 'closed', sectionNumber?: number} = { state: 'closed' };


  private matCollapsibleInstance: M.Collapsible;

  private readonly openIcon = 'keyboard_arrow_down';
  private readonly closeIcon = 'keyboard_arrow_up';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.matCollapsibleInstance = M.Collapsible.init(this.elementRef.nativeElement, {
      onCloseEnd: this.onCloseCallback,
      onOpenEnd: this.onOpenCallback,
    });
    if (this.initialState.state === 'open') {
      this.matCollapsibleInstance.open(this.initialState.sectionNumber ?? 0);
    }
  }

  private onCloseCallback = (el: Element) => {
    const collapsibleIcon = el.getElementsByClassName('material-icons')[0];
    this.changeIcon(collapsibleIcon, this.openIcon);
  };

  private onOpenCallback = (el: Element) => {
    const collapsibleIcon = el.getElementsByClassName('material-icons')[0];
    this.changeIcon(collapsibleIcon, this.closeIcon);
  };

  private changeIcon(collapsibleIcon: Element, icon: string) {
    this.renderer.setProperty(collapsibleIcon, 'innerHTML', icon);
  }

  ngOnDestroy(): void {
    this.matCollapsibleInstance.destroy();
  }
}
