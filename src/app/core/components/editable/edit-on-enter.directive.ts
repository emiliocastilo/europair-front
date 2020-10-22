import { Directive, HostListener } from '@angular/core';
import { EditableComponent } from './editable.component';

@Directive({
  selector: '[appEditOnEnter]'
})
export class EditOnEnterDirective {
  constructor(private editable: EditableComponent) {
  }

  @HostListener('keyup.enter')
  onEnter() {
    this.editable.toViewMode();
  }
}
