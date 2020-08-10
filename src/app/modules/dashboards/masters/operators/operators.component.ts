import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import {
  EMPTY_OPERATOR,
  Operator,
  Certification,
} from './models/Operator.model';
import { OperatorsTableAdapterService } from './services/operators-table-adapter.service';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { OperatorsService } from './services/operators.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { OperatorDetailComponent } from './components/operator-detail/operator-detail.component';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
  providers: [OperatorsTableAdapterService],
})
export class OperatorsComponent implements OnInit {
  @ViewChild(OperatorDetailComponent, { static: true, read: ElementRef })
  public operatorDetailModal: ElementRef;

  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public readonly pageTitle = 'Operadores';
  private readonly VIEW_OPERATOR_TITLE = 'Detalle operador';
  private readonly EDIT_OPERATOR_TITLE = 'Editar operador';
  private readonly CREATE_OPERATOR_TITLE = 'Crear operador';

  public operatorSelected: Operator = EMPTY_OPERATOR;
  public operatorsSelectedCount = 0;

  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo operador' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
  ];

  public operatorColumnsHeader: ColumnHeaderModel[] = [];
  public operatorColumnsData: RowDataModel[] = [];
  public operatorColumnsPagination: PaginationModel;

  public operatorDetailTitle: string;
  public operators: Operator[] = [];

  public operatorObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public operatorObservationsColumnsData: RowDataModel[] = [];
  public operatorObservationsColumnsPagination: PaginationModel;

  public operatorCertificationsColumnsHeader: ColumnHeaderModel[] = [];
  public operatorCertificationsColumnsData: RowDataModel[] = [];
  public operatorCertificationsColumnsPagination: PaginationModel;

  private barButtonActions = { new: this.newOperator };
  private operatorTableActions = {
    view: this.viewOperator,
    edit: this.editOperator,
    delete: this.deleteOperator,
  };

  public operatorForm = this.fb.group({
    name: ['', Validators.required],
    iataCode: ['', Validators.required],
    icaoCode: ['', Validators.required],
    aocLastRevisionDate: ['', Validators.required],
    insuranceExpirationDate: [''],
    aocNumber: ['', Validators.required],
    certifications: [''],
    observations: [''],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private operatorsService: OperatorsService,
    private operatorTableAdapter: OperatorsTableAdapterService
  ) {}

  ngOnInit(): void {
    this.initializeOperatorsTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeTablesColumnsHeader() {
    this.operatorColumnsHeader = this.operatorTableAdapter.getOperatorColumnsHeader();
    this.operatorCertificationsColumnsHeader = this.operatorTableAdapter.getOperatorCertificationsColumnsHeader();
    this.operatorObservationsColumnsHeader = this.operatorTableAdapter.getOperatorObservationsColumnsHeader();
  }

  private initializeOperatorsTable() {
    this.operatorsService.getOperators().subscribe((operatorPage) => {
      this.getOperatorTableData(operatorPage);
    });
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

  private getOperatorDetailData(
    data: any,
    operatorDetailTitle: string,
    operatorSelected: Operator,
    editable = true
  ) {
    this.operatorCertificationsColumnsData = this.getOperatorCertificationsTableDataForOperator(
      operatorSelected,
      [], // data.certifications.content,
      editable
    );
    this.operatorCertificationsColumnsPagination = this.initializeClientTablePagination(
      this.operatorCertificationsColumnsData
    );

    this.operatorObservationsColumnsData = this.getOperatorObservationsTableDataForOperator(
      operatorSelected,
      [], // data.observations.content,
      editable
    );
    this.operatorObservationsColumnsPagination = this.initializeClientTablePagination(
      this.operatorObservationsColumnsData
    );

    this.operatorDetailTitle = operatorDetailTitle;
    this.initializeModal(this.operatorDetailModal);
    this.modalService.openModal();
  }

  private getOperatorCertificationsTableDataForOperator(
    operator: Operator,
    certifications: Certification[] = [],
    editable = true
  ): RowDataModel[] {
    const operatorCertifications = operator ? operator.certifications : [];
    return this.operatorTableAdapter.getCertificationTableData(
      certifications,
      operatorCertifications,
      'assigned-certification-',
      editable
    );
  }

  private getOperatorObservationsTableDataForOperator(
    operator: Operator,
    observations: any[] = [],
    editable = true
  ): RowDataModel[] {
    const operatorObservations = operator ? operator.observations : [];
    return this.operatorTableAdapter.getOperatorObservationsTableData(
      observations,
      operatorObservations,
      'assigned-base-',
      editable
    );
  }

  private viewOperator(selectedItem: number) {
    // this.getTasksAndRoles$().subscribe(this.getViewUserDetailData);
    this.getViewOperatorDetailData(null);
  }

  private getViewOperatorDetailData(data: any) {
    this.updateOperatorForm(this.operatorSelected);
    this.operatorForm.disable();
    this.getOperatorDetailData(
      data,
      this.VIEW_OPERATOR_TITLE,
      this.operatorSelected,
      false
    );
  }

  private updateOperatorForm(selectedOperator: Operator) {
    this.operatorForm.setValue({
      name: selectedOperator.name,
      iataCode: selectedOperator.iataCode,
      icaoCode: selectedOperator.icaoCode,
      aocLastRevisionDate: selectedOperator.aocLastRevisionDate,
      aocNumber: selectedOperator.aocNumber,
      insuranceExpirationDate: selectedOperator.insuranceExpirationDate,
      certifications: selectedOperator.certifications,
      observations: selectedOperator.observations,
    });
  }

  private editOperator(selectedItem: number) {
    // this.getTasksAndRoles$().subscribe(this.getEditUserDetailData);
    this.getEditOperatorDetailData(null);
  }

  private getEditOperatorDetailData(data: any) {
    this.updateOperatorForm(this.operatorSelected);
    this.operatorForm.enable();
    this.getOperatorDetailData(
      data,
      this.EDIT_OPERATOR_TITLE,
      this.operatorSelected
    );
  }

  private deleteOperator(selectedItem: number) {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  private newOperator() {
    // this.getTasksAndRoles$().subscribe(this.getNewUserDetailData);
    this.getNewOperatorDetailData(null);
  }

  private getNewOperatorDetailData(data: any) {
    this.operatorSelected = { ...EMPTY_OPERATOR };
    this.operatorForm.enable();
    this.operatorForm.reset();
    this.getOperatorDetailData(
      data,
      this.CREATE_OPERATOR_TITLE,
      EMPTY_OPERATOR
    );
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

  public onSaveOperator(newUOperator: Operator) {
    // TODO: utilizar datepickers para las propiedades que son fechas
    newUOperator.aocLastRevisionDate = new Date(
      newUOperator.aocLastRevisionDate
    );
    newUOperator.insuranceExpirationDate = new Date(
      newUOperator.insuranceExpirationDate
    );

    this.operatorsService
      .saveOperator(newUOperator)
      .subscribe(() => this.initializeOperatorsTable());
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.operatorTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
