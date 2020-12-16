import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Certification, EMPTY_OPERATOR, Operator, OperatorComment } from '../../models/Operator.model';
import { OperatorsTableAdapterService } from '../../services/operators-table-adapter.service';
import { OperatorsService } from '../../services/operators.service';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { DetailCertificationsComponent } from './components/detail-certifications/detail-certifications.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { DetailCommentsComponent } from './components/detail-comments/detail-comments.component';

@Component({
  selector: 'app-operator-detail',
  templateUrl: './operator-detail.component.html',
  styleUrls: ['./operator-detail.component.scss'],
  providers: [OperatorsTableAdapterService],
})
export class OperatorDetailComponent implements OnInit, OnDestroy {
  @ViewChild(DetailCertificationsComponent, { static: true, read: ElementRef })
  public certifiedOperatorCreatorModal: ElementRef;
  @ViewChild(DetailCommentsComponent, { static: true, read: ElementRef })
  public commentOperatorCreatorModal: ElementRef;
  @ViewChild('confirmDeleteCertification', { static: true, read: ElementRef })
  public confirmDeleteCertificationModal: ElementRef;
  @ViewChild('confirmDeleteComment', { static: true, read: ElementRef })
  public confirmDeleteCommentModal: ElementRef;
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

  public operatorSelected: Certification;
  public commentSelected: OperatorComment;

  public operatorsSelectedCount: number = 0;
  public operatorsBarButtons: BarButton[] = [
    { text: 'Añadir', type: BarButtonType.NEW },
    { text: 'Editar', type: BarButtonType.EDIT },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];
  public commentsSelectedCount: number = 0;
  public commentsBarButtons: BarButton[] = [
    { text: 'Añadir', type: BarButtonType.NEW },
    { text: 'Editar', type: BarButtonType.EDIT },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];

  private operatorId: number;

  private barButtonCertificationActions = {
    new: this.addOperator.bind(this),
    edit: this.editOperator.bind(this),
    delete_selected: this.deleteOperator.bind(this)
  };

  private barButtonCommentsActions = {
    new: this.addComment.bind(this),
    edit: this.editComment.bind(this),
    delete_selected: this.deleteComment.bind(this)
  };

  public certifiedOperatorForm = this.fb.group({
    id: [null],
    comments: ['', Validators.required]
  });

  public commentOperatorForm = this.fb.group({
    id: [null],
    comment: ['', Validators.required]
  });

  private readonly certifiedOperatorFormDefaultValues = {
    id: null,
    comments: '',
  } as const;

  private readonly commentOperatorFormDefaultValues = {
    id: null,
    comments: '',
  } as const;

  public operatorModalModeCreate: boolean = true;
  public commentModalModeCreate: boolean = true;

  public operatorForm = this.fb.group({
    name: ['', [Validators.required]],
    iataCode: ['', [Validators.maxLength(3)]],
    icaoCode: ['', [Validators.maxLength(4)]],
    aocLastRevisionDate: [''],
    insuranceExpirationDate: [''],
    aocNumber: [''],
  });

  constructor(
    private fb: FormBuilder,
    private operatorsService: OperatorsService,
    private operatorTableAdapter: OperatorsTableAdapterService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly modalService: ModalService
  ) { }

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
          this.operatorId = operatorId;
          this.retrieveOperatorData();
        });
    }
  }

  private retrieveOperatorData() {
    this.operatorsService
      .getOperatorById(this.operatorId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((operatorData) => {
        this.operatorDetail = { ...EMPTY_OPERATOR, ...operatorData };
        this.updateOperatorForm(this.operatorDetail);
        this.updateCertifications(operatorData.id);
        this.updateComments(operatorData.id);
      });
  }

  public onOperatorSelected(operatorIndex: number): void {
    this.operatorSelected = this.operatorCertifications[operatorIndex];
    this.operatorsSelectedCount = 1;
  }

  public onCommentSelected(operatorIndex: number): void {
    this.commentSelected = this.operatorObservations[operatorIndex];
    this.commentsSelectedCount = 1;
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

  public viewFleet(): void {
    this.router.navigate(['fleet/aircraft'], { queryParams: { operatorId: this.operatorDetail.id} });
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

  public onBarButtonCertificationClicked(barButtonType: BarButtonType) {
    this.barButtonCertificationActions[barButtonType]();
  }

  private addOperator(): void {
    this.operatorModalModeCreate = true;
    this.certifiedOperatorForm.reset(this.certifiedOperatorFormDefaultValues);
    this.initializeModal(this.certifiedOperatorCreatorModal);
    this.modalService.openModal();
  }

  private editOperator(): void {
    this.operatorModalModeCreate = false;
    this.certifiedOperatorForm.reset(this.certifiedOperatorFormDefaultValues);
    this.certifiedOperatorForm.patchValue(this.operatorSelected);
    this.initializeModal(this.certifiedOperatorCreatorModal);
    this.modalService.openModal();
  }

  private deleteOperator(): void {
    this.initializeModal(this.confirmDeleteCertificationModal);
    this.modalService.openModal();
  }

  public onSaveCertifiedOperator(newCertifiedOperator: Certification): void {
    this.operatorsService.saveCertification(this.operatorId, newCertifiedOperator)
      .subscribe((certification: Certification) => {
        this.operatorSelected = certification;
        this.updateCertifications(this.operatorId);
      });
  }

  public onConfirmDeleteOperator(): void {
    this.operatorsService.removeCertification(this.operatorId, this.operatorSelected.id)
    .subscribe(() => {
      this.operatorSelected = undefined;
      this.updateCertifications(this.operatorId);
    });
  }

  public onBarButtonCommentsClicked(barButtonType: BarButtonType) {
    this.barButtonCommentsActions[barButtonType]();
  }

  private addComment(): void {
    this.commentModalModeCreate = true;
    this.commentOperatorForm.reset(this.commentOperatorFormDefaultValues);
    this.initializeModal(this.commentOperatorCreatorModal);
    this.modalService.openModal();
  }

  private editComment(): void {
    this.commentModalModeCreate = false;
    this.commentOperatorForm.reset(this.commentOperatorFormDefaultValues);
    this.commentOperatorForm.patchValue(this.commentSelected);
    this.initializeModal(this.commentOperatorCreatorModal);
    this.modalService.openModal();
  }

  private deleteComment(): void {
    this.initializeModal(this.confirmDeleteCommentModal);
    this.modalService.openModal();
  }

  public onSaveCommentOperator(newCommentOperator: OperatorComment): void {
    this.operatorsService.saveOperatorComment(this.operatorId, newCommentOperator)
      .subscribe((comment: OperatorComment) => {
        this.commentSelected = comment;
        this.updateComments(this.operatorId);
      });
  }

  public onConfirmDeleteComment(): void {
    this.operatorsService.removeOperatorComment(this.operatorId, this.commentSelected.id)
    .subscribe(() => {
      this.commentSelected = undefined;
      this.updateComments(this.operatorId);
    });
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }
}
