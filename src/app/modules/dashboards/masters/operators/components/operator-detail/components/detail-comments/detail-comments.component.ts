import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OperatorComment } from '../../../../models/Operator.model';

@Component({
  selector: 'app-detail-comments',
  templateUrl: './detail-comments.component.html',
  styleUrls: ['./detail-comments.component.scss']
})
export class DetailCommentsComponent {
  @Input()
  public commentOperator: OperatorComment;
  @Input()
  public commentOperatorForm: FormGroup;
  @Input()
  public modeCreate: boolean;
  @Output()
  public saveCommentOperator = new EventEmitter<OperatorComment>();

  constructor() { }

  public onSaveCommentOperator() {
    this.saveCommentOperator.next({
      id: this.modeCreate ? undefined : this.commentOperator.id,
      comment: this.commentOperatorForm.get('comment').value
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.commentOperatorForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.commentOperatorForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
