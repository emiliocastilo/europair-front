import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import {
  EMPTY_OPERATOR,
  Operator,
} from '../../models/Operator.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { OperatorsService } from '../../services/operators.service';
import { OperatorsTableAdapterService } from '../../services/operators-table-adapter.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Router } from '@angular/router';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { FormBuilder } from '@angular/forms';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss'],
  providers: [OperatorsTableAdapterService],
})
export class OperatorListComponent implements OnInit {
  @ViewChild('confirmMultipleDisableModal', { static: true, read: ElementRef })
  private readonly confirmMultipleDisableModal: ElementRef;
  @ViewChild('confirmDisableModal', { static: true, read: ElementRef })
  private readonly confirmDisableModal: ElementRef;

  public readonly pageTitle = 'Operadores';

  public operatorSelected: Operator = EMPTY_OPERATOR;

  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'OPERATORS.NEW' },
    { type: BarButtonType.DELETE_SELECTED, text: 'OPERATORS.DISABLE' },
  ];

  public operatorColumnsHeader: ColumnHeaderModel[] = [];
  public operatorColumnsData: RowDataModel[] = [];
  public operatorColumnsPagination: PaginationModel;

  public operatorDetailTitle: string;
  public operators: Operator[] = [];
  public selectedItems: number[] = [];
  public translationParams = {};
  private operatorFilter = {};


  private barButtonActions = {
    new: this.newOperator,
    delete_selected: this.disableSelectedOperators,
  };

  private operatorTableActions = {
    edit: this.editOperator,
    delete: this.disableOperator,
  };

  public operatorAdvancedSearchForm = this.fb.group({
    filter_iataCode: [''],
    filter_icaoCode: [''],
    filter_name: [''],
    filter_removedAt: [null],
  });
  public operatorSortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private modalService: ModalService,
    private operatorsService: OperatorsService,
    private operatorTableAdapter: OperatorsTableAdapterService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.filterOperatorTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeTablesColumnsHeader() {
    this.operatorColumnsHeader = this.operatorTableAdapter.getOperatorColumnsHeader();
  }

  private initializeOperatorsTable(searchFilter?: SearchFilter) {
    this.operatorsService.getOperators(searchFilter).subscribe((operatorPage) => {
      this.getOperatorTableData(operatorPage);
    });
  }

  private newOperator(): void {
    this.router.navigate(['operators', 'new']);
  }

  private disableSelectedOperators(): void {
    this.initializeModal(this.confirmMultipleDisableModal);
    this.modalService.openModal();
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

  private disableOperator(selectedItem: number) {
    this.translationParams = {operator: this.operators[selectedItem]?.name};
    this.initializeModal(this.confirmDisableModal);
    this.modalService.openModal();
  }

  public onOperatorsSelected(selectedItems: number[]): void {
    this.selectedItems = selectedItems;
  }

  public onFilterOperators(operatortFilter: ColumnFilter) {
    this.operatorFilter[operatortFilter.identifier] = operatortFilter.searchTerm;
    this.filterOperatorTable();
  }

  public onSortOperators(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.operatorSortForm.patchValue({ sort: sort });
    this.filterOperatorTable();
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType].bind(this)();
  }

  public onSearch(value: string): void {
    this.operatorFilter['search'] = value;
    this.filterOperatorTable();
  }

  public checkShowDisabled(showDisabled: boolean): void {
    if (showDisabled) {
      this.operatorFilter['filter_removedAt'] = '';
    } else {
      this.operatorFilter['filter_removedAt'] = null;
    }
    this.filterOperatorTable();
  }

  public onOperatorAction(action: { actionId: string; selectedItem: number }) {
    this.operatorSelected = { ...this.operators[action.selectedItem] };
    this.operatorTableActions[action.actionId].bind(this)(action.selectedItem);
  }

  public onConfirmDisableOperator() {
    this.operatorsService
      .removeOperator(this.operatorSelected)
      .subscribe((_) => this.filterOperatorTable());
  }

  public onConfirmDisableMultipleOperators() {
    console.log('DELETING OPERATORS ', this.selectedItems.map(item => this.operators[item].id));
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.operatorTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }

  private filterOperatorTable(): void {
    this.operatorAdvancedSearchForm.patchValue(this.operatorFilter);
    const filter = {
      ...this.operatorAdvancedSearchForm.value,
      ...this.operatorSortForm.value,
      size: '30000'
    };
    this.initializeOperatorsTable(filter);
  }
}
