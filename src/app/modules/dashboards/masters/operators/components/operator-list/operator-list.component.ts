import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import {
  EMPTY_OPERATOR,
  Operator,
  Certification,
} from '../../models/Operator.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { OperatorsService } from '../../services/operators.service';
import { OperatorsTableAdapterService } from '../../services/operators-table-adapter.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { OperatorDetailComponent } from '../operator-detail/operator-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss'],
  providers: [OperatorsTableAdapterService],
})
export class OperatorListComponent implements OnInit {
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public readonly pageTitle = 'Operadores';

  public operatorSelected: Operator = EMPTY_OPERATOR;
  public operatorsSelectedCount = 0;

  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo operador' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
    // { type: BarButtonType.SEARCH, text: 'search' },
  ];

  public operatorColumnsHeader: ColumnHeaderModel[] = [];
  public operatorColumnsData: RowDataModel[] = [];
  public operatorColumnsPagination: PaginationModel;

  public operatorDetailTitle: string;
  public operators: Operator[] = [];

  private barButtonActions = { new: this.newOperator };

  private operatorTableActions = {
    edit: this.editOperator,
    delete: this.deleteOperator,
  };

  constructor(
    private modalService: ModalService,
    private operatorsService: OperatorsService,
    private operatorTableAdapter: OperatorsTableAdapterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeOperatorsTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeTablesColumnsHeader() {
    this.operatorColumnsHeader = this.operatorTableAdapter.getOperatorColumnsHeader();
  }

  private initializeOperatorsTable() {
    this.operatorsService.getOperators().subscribe((operatorPage) => {
      this.getOperatorTableData(operatorPage);
    });
  }

  private newOperator(): void {
    this.router.navigate(['operators', 'new']);
  }

  private editOperator(selectedItem: number): void {
    this.router.navigate(['operators', this.operators[selectedItem].id]);
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  private getOperatorTableData(operators: Page<Operator>) {
    this.operators = operators.content;
    this.operatorColumnsData = this.operatorTableAdapter.getOperatorTableDataFromOperators(
      operators.content
    );
    this.operatorColumnsPagination = this.initializeClientTablePagination(
      this.operatorColumnsData
    );
  }

  private deleteOperator(selectedItem: number) {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType].bind(this)();
  }

  public onOperatorSelected(selectedIndex: number) {
    // console.log('onOperatorSelected', selectedIndex);
  }

  public onOperatorAction(action: { actionId: string; selectedItem: number }) {
    this.operatorSelected = { ...this.operators[action.selectedItem] };
    this.operatorTableActions[action.actionId].bind(this)(action.selectedItem);
  }

  public onConfirmDeleteOperator() {
    this.operatorsService
      .removeOperator(this.operatorSelected)
      .subscribe((_) => this.initializeOperatorsTable());
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.operatorTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
