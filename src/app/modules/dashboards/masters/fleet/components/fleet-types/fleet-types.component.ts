import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { FleetType, EMPTY_FLEET_TYPE } from '../../models/fleet';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { FleetTypesService } from './services/fleet-types.service';
import { FleetTypesTableAdapterService } from './services/fleet-types-table-adapter.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Observable } from 'rxjs';
import { FleetTypeDetailComponent } from './components/fleet-type-detail/fleet-type-detail.component';

@Component({
  selector: 'app-fleet-types',
  templateUrl: './fleet-types.component.html',
  styleUrls: ['./fleet-types.component.scss'],
})
export class FleetTypesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
