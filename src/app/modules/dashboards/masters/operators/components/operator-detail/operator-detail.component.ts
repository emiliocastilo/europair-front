import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, distinct } from 'rxjs/operators';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import {
  Certification,
  EMPTY_OPERATOR,
  Operator,
  OperatorComment,
} from '../../models/Operator.model';
import { OperatorsTableAdapterService } from '../../services/operators-table-adapter.service';
import { OperatorsService } from '../../services/operators.service';

@Component({
  selector: 'app-operator-detail',
  templateUrl: './operator-detail.component.html',
  styleUrls: ['./operator-detail.component.scss'],
  providers: [OperatorsTableAdapterService],
})
export class OperatorDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  public pageTitle: string;

  public operatorObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public operatorObservationsColumnsData: RowDataModel[] = [];
  public operatorObservationsColumnsPagination: PaginationModel;

  public operatorCertificationsColumnsHeader: ColumnHeaderModel[] = [];
  public operatorCertificationsColumnsData: RowDataModel[] = [];
  public operatorCertificationsColumnsPagination: PaginationModel;

  public operatorDetail: Operator = { ...EMPTY_OPERATOR };
  public operatorObservations: OperatorComment[] = [];
  public operatorCertifications: Certification[] = [];

  public operatorForm = this.fb.group({
    name: ['', [Validators.required]],
    iataCode: ['', [Validators.required, Validators.maxLength(3)]],
    icaoCode: ['', [Validators.required, Validators.maxLength(4)]],
    aocLastRevisionDate: ['', [Validators.required]],
    insuranceExpirationDate: [''],
    aocNumber: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private operatorsService: OperatorsService,
    private operatorTableAdapter: OperatorsTableAdapterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeOperatorData(this.route.snapshot.data);
    this.initializeTablesColumnsHeader();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeTablesColumnsHeader() {
    this.operatorCertificationsColumnsHeader = this.operatorTableAdapter.getOperatorCertificationsColumnsHeader();
    this.operatorObservationsColumnsHeader = this.operatorTableAdapter.getOperatorObservationsColumnsHeader();
  }

  private initializeOperatorData({ title, isOperatorDetail }: any) {
    this.pageTitle = title;
    if (isOperatorDetail) {
      this.route.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ operatorId }) => {
          this.retrieveOperatorData(operatorId);
        });
    }
  }

  private retrieveOperatorData(operatorId: number) {
    this.operatorsService
      .getOperatorById(operatorId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((operatorData) => {
        this.operatorDetail = { ...EMPTY_OPERATOR, ...operatorData };
        this.updateOperatorForm(this.operatorDetail);
        this.updateCertifications(operatorData.id);
        this.updateComments(operatorData.id);
      });
  }

  private updateCertifications(operatorId: number) {
    this.operatorsService
      .getOperatorCertifications(operatorId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((certificationsPage) => {
        this.operatorCertifications = certificationsPage.content;
        this.operatorCertificationsColumnsData = this.operatorTableAdapter.getCertificationTableData(
          certificationsPage.content
        );
        this.operatorCertificationsColumnsPagination = this.initializeClientTablePagination(
          this.operatorCertificationsColumnsData
        );
      });
  }

  private updateComments(operatorId: number) {
    this.operatorsService
      .getOperatorComments(operatorId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((commentsPage) => {
        this.operatorObservations = commentsPage.content;
        this.operatorObservationsColumnsData = this.operatorTableAdapter.getOperatorObservationsTableData(
          commentsPage.content
        );
        this.operatorObservationsColumnsPagination = this.initializeClientTablePagination(
          this.operatorObservationsColumnsData
        );
      });
  }

  private updateOperatorForm(selectedOperator: Operator) {
    this.operatorForm.setValue({
      name: selectedOperator.name,
      iataCode: selectedOperator.iataCode,
      icaoCode: selectedOperator.icaoCode,
      aocLastRevisionDate: selectedOperator.aocLastRevisionDate,
      aocNumber: selectedOperator.aocNumber,
      insuranceExpirationDate: selectedOperator.insuranceExpirationDate,
    });
  }

  public onSaveOperator() {
    this.operatorsService
      .saveOperator({
        ...this.operatorDetail,
        ...this.operatorForm.value,
      })
      .subscribe(() => {
        this.router.navigate(['operators']);
      });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.operatorForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.operatorForm.get(controlName);
    return control && control.hasError(errorName);
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.operatorTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
