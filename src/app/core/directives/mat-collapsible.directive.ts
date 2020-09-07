import {
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  Input,
  OnInit,
  AfterContentChecked,
} from '@angular/core';

@Directive({
  selector: '[appMatCollapsible]',
})
export class MatCollapsibleDirective
  implements OnDestroy, OnInit, AfterContentChecked {
  @Input('appMatCollapsible')
  public initialState: {
    state: 'open' | 'closed';
    sectionNumber?: number;
    iconOverride?: boolean;
  } = { state: 'closed', iconOverride: false };

  private componentInitialized = false;
  private matCollapsibleInstance: M.Collapsible;
  private readonly openIcon = 'keyboard_arrow_down';
  private readonly closeIcon = 'keyboard_arrow_up';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.matCollapsibleInstance = M.Collapsible.init(
      this.elementRef.nativeElement,
      {
        onCloseEnd: this.onCloseCallback,
        onOpenEnd: this.onOpenCallback,
      }
    );
  }

  ngAfterContentChecked(): void {
    this.initializeContent(this.elementRef.nativeElement);
  }

  private initializeContent(el: Element) {
    const collapsibleIcon = el.getElementsByClassName('material-icons')[0];

    if (collapsibleIcon && !this.componentInitialized) {
      this.componentInitialized = true;
      if (this.initialState.state === 'open') {
        this.matCollapsibleInstance.open(this.initialState.sectionNumber ?? 0);
      }
    }
  }

  private onCloseCallback = (el: Element) => {
    if (!this.initialState.iconOverride) {
      const collapsibleIcon = el.getElementsByClassName('material-icons')[0];
      this.changeIcon(collapsibleIcon, this.openIcon);
    }
  };

  private onOpenCallback = (el: Element) => {
    if (!this.initialState.iconOverride) {
      const collapsibleIcon = el.getElementsByClassName('material-icons')[0];
      this.changeIcon(collapsibleIcon, this.closeIcon);
    }
  };

  private changeIcon(collapsibleIcon: Element, icon: string) {
    this.renderer.setProperty(collapsibleIcon, 'innerHTML', icon);
  }

  ngOnDestroy(): void {
    this.matCollapsibleInstance.destroy();
  }
}
