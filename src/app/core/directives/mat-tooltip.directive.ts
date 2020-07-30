import { Directive, Input, ElementRef } from '@angular/core';


@Directive({
  selector: '[appMatTooltip]'
})
export class MatTooltipDirective {

  @Input('matTooltipPosition') tooltipPosition: "top" | "right" | "bottom" | "left";
  @Input('appMatTooltip') data : string;

  private matTooltipInstance: M.Tooltip;
  private elementRef : ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  protected ngOnChanges() {
    if(this.data !== undefined){
      this.configureMaterializeTooltip(this.data);
    }
  }

  ngOnDestroy() {
    if(this.matTooltipInstance){
      this.matTooltipInstance.destroy();
    }
  }

  protected configureMaterializeTooltip(message : String){

    this.elementRef.nativeElement.setAttribute("data-tooltip", message);
    this.matTooltipInstance = M.Tooltip.init(this.elementRef.nativeElement, {
      exitDelay: 100,
      enterDelay: 1200,
      inDuration: 750,
      outDuration: 750,
      position: this.tooltipPosition
    });
  }
}
