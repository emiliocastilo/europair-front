import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Certification,
  Operator,
} from 'src/app/modules/dashboards/masters/operators/models/Operator.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { OperatorsService } from 'src/app/modules/dashboards/masters/operators/services/operators.service';
import { map, tap } from 'rxjs/operators';
import { AirportOperatorsTableAdapterService } from '../services/airport-operators-table-adapter.service';

@Component({
  selector: 'app-airport-certified-operator-creator',
  templateUrl: './airport-certified-operator-creator.component.html',
  styleUrls: ['./airport-certified-operator-creator.component.scss'],
})
export class AirportCertifiedOperatorCreatorComponent implements OnInit {
  @Input()
  public certifiedOperatorForm: FormGroup;
  @Output()
  public addCertifiedOperator = new EventEmitter<Certification>();

  public operatorsColumnsHeader: ColumnHeaderModel[];
  public operatorsColumnsData: RowDataModel[];
  public operatorsPagination: PaginationModel;
  public operatorSelected: Operator;
  private operators: Operator[];
  private operatorFilter: any = {};

  constructor(
    private operatorsService: OperatorsService,
    private operatorsTableAdapterService: AirportOperatorsTableAdapterService
  ) {}

  ngOnInit(): void {
    this.refreshRegionsEditorTableData();
    this.operatorsPagination = this.operatorsTableAdapterService.getPagination();
    this.operatorsColumnsHeader = this.operatorsTableAdapterService.getOperatorsColumnsHeader();
  }

  private refreshRegionsEditorTableData(): void {
    this.operatorsService
      .getOperators()
      .pipe(
        map((paginatedOperators) => paginatedOperators.content),
        tap(this.getOperators)
      )
      .subscribe(
        (operators: Operator[]) =>
          (this.operatorsColumnsData = this.operatorsTableAdapterService.getOperatorsTableData(
            operators
          ))
      );
  }

  private getOperators = (operators: Operator[]): void => {
    this.operatorsPagination = {
      ...this.operatorsPagination,
      lastPage: operators.length / this.operatorsPagination.elementsPerPage,
    };
    this.operators = operators;
  };

  public onAddCertifiedOperator() {
    this.addCertifiedOperator.next({
      ...this.certifiedOperatorForm.value,
      operator: this.operatorSelected,
    });
  }

  public onOperatorelected(regionIndex: number): void {
    this.operatorSelected = this.operators[regionIndex];
  }

  public onFilterOperators(filter: ColumnFilter) {
    this.operatorFilter[filter.identifier] = filter.searchTerm;
    this.filterOperatorTable();
  }

  public onSortOperators(sortByColumn: SortByColumn) {
    this.operatorFilter['sort'] =
      sortByColumn.column + ',' + sortByColumn.order;
    this.filterOperatorTable();
  }

  private filterOperatorTable() {
    console.log('FILTERING OPERATOR TABLE', this.operatorFilter);
    this.refreshRegionsEditorTableData();
  }

  public hasAnyOperatorSelected(): boolean {
    return !!this.operatorSelected;
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.certifiedOperatorForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.certifiedOperatorForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
