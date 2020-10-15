import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmOperationDialogData } from './models/confirm-operation.model';

@Component({
  selector: 'app-confirm-operation-dialog',
  templateUrl: './confirm-operation-dialog.component.html',
  styleUrls: ['./confirm-operation-dialog.component.scss']
})
export class ConfirmOperationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmOperationDialogData) { }

  ngOnInit(): void {
  }

}
