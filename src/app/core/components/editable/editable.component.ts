import { Component, ContentChild, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMapTo, take, takeUntil } from 'rxjs/operators';
import { EditModeDirective } from './edit-mode.directive';
import { ViewModeDirective } from './view-mode.directive';

@Component({
  selector: 'core-editable',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent implements OnInit {

  @ContentChild(ViewModeDirective) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl: EditModeDirective;
  @Output() update = new EventEmitter();

  editMode = new Subject();
  unsubscriber$ = new Subject();
  editMode$ = this.editMode.asObservable();

  mode: 'view' | 'edit' = 'view';


  constructor(private host: ElementRef) {
  }

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();
  }

  toViewMode() {
    this.update.next();
    this.mode = 'view';
  }

  private get element() {
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, 'dblclick').pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe(() => {
      this.mode = 'edit';
      this.editMode.next(true);
    });
    // MOBILE
    fromEvent(this.element, 'touchend').pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe(() => {
      this.mode = 'edit';
      this.editMode.next(true);
    });
  }

  private editModeHandler() {
    const clickOutside$ = fromEvent(document, 'click').pipe(
      filter(({ target }) => this.element.contains(target) === false),
      take(1)
    )

    this.editMode$.pipe(
      switchMapTo(clickOutside$),
      takeUntil(this.unsubscriber$)
    ).subscribe(event => this.toViewMode());
  }

  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
