import { Component, OnInit, Input } from '@angular/core';

import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';

@Component({
  selector: 'core-letter-table',
  templateUrl: './letter-table.component.html',
  styleUrls: ['./letter-table.component.scss']
})
export class LetterTableComponent implements OnInit {
  @Input() columnsHeader:Array<ColumnHeaderModel>;
  @Input() columnsData:Array<RowDataModel>;

  constructor() { }

  ngOnInit(): void {
  }

}
