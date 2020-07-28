import { Directive, Input, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTooltipDirective } from '../directives/mat-tooltip.directive';
import { RowDataModel } from '../models/table/row-data.model';

@Directive({
  selector: '[appTableAuditTooltip]',
  providers:[DatePipe]
})
export class TableAuditTooltipDirective extends MatTooltipDirective {

  @Input('matTooltipPosition') tooltipPosition: "top" | "right" | "bottom" | "left";
  @Input('appTableAuditTooltip') auditData : RowDataModel;

  private datepite : DatePipe;

  constructor(elementRef: ElementRef, public datepipe: DatePipe) {
    super(elementRef);
    this.datepipe = datepipe;
  }

  protected ngOnChanges() {
    if(this.auditData !== undefined && this.auditData.author !== undefined){
      let auditMessage : string = `${this.auditData.modified? 'Modificado por':'Creado por'} <i>${this.auditData.author} < ${this.datepipe.transform(this.auditData.timestamp,'full')}></i>`;
      this.configureMaterializeTooltip(auditMessage);
    }
}
}
