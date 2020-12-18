import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Contract, ContractStates } from '../../../../models/Contract.model';
import { ContractsService } from '../../../../services/contracts.service';
import { CancellationFees } from '../../models/cancellation-fees.model';
import { CancellationFeesService } from '../../services/cancellation-fees.service';

@Component({
  selector: 'app-cancellation-fees',
  templateUrl: './cancellation-fees.component.html',
  styleUrls: ['./cancellation-fees.component.scss'],
})
export class CancellationFeesComponent implements OnInit {
  public cancellationFees: Array<CancellationFees>;
  public fileId: number;
  public contractId: number;
  public contract: Contract;
  public isCancellationFeeFormVisible: boolean = false;

  public cancellationFeesDataSource = new MatTableDataSource<CancellationFees>();
  public selection = new SelectionModel<CancellationFees>(false, []);
  public columnsToDisplay = ['selection', 'fromValue', 'fromUnit', 'feePercentage', 'actions'];

  public cancellationFeeForm: FormGroup = this.fb.group({
    id: [null],
    fromValue: ['', [Validators.required, Validators.min(0)]],
    fromUnit: ['', Validators.required],
    feePercentage: ['', [Validators.required, Validators.min(1)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly cancellationFeesService: CancellationFeesService,
    private readonly matDialog: MatDialog,
    private readonly contractsService: ContractsService
  ) { }

  ngOnInit(): void {
    this.getRouteData();
  }

  private getRouteData() {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.getContract();
    });
  }

  private getContract() {
    this.contractsService
      .getContract(this.fileId, this.contractId)
      .subscribe((contract: Contract) => {
        this.contract = contract;
        this.getCancellationFees(this.contractId);
      });
  }

  private getCancellationFees(contractId: number): void {
    this.hideCancellationFeeForm();
    this.cancellationFeesService.getCancellationFees({ 'filter_contract.id': contractId.toString(), size: '100' })
    .subscribe((page: Page<CancellationFees>) => {
      this.cancellationFees = page.content;
      this.cancellationFeesDataSource = new MatTableDataSource(page.content);
    });
  }

  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }

  public deleteCancellationFee(cancellationFee: CancellationFees) {
    const confirmOperationRef = this.matDialog.open(ConfirmOperationDialogComponent, {
      data: {
        title: 'FILES_CONTRACT.CANCELLATION_FEES.DELETE_TITLE',
        message: 'FILES_CONTRACT.CANCELLATION_FEES.DELETE_MSG',
        translationParams: cancellationFee
      }
    });
    confirmOperationRef.afterClosed().subscribe(result => {
      if(result) {
        this.cancellationFeesService.removeCancellationFees(cancellationFee)
          .subscribe(() => this.getCancellationFees(this.contractId));
      }
    });
  }

  public onCancellationFeeSelected(cancellationFees: CancellationFees) {
    this.selection.toggle(cancellationFees);
    if(this.isContractSigned() || this.selection.isEmpty()) {
      this.hideCancellationFeeForm();
    }else {
      this.updateCancellationFeeForm(cancellationFees);
      this.showCancellationFeeForm();
    }
  }

  private updateCancellationFeeForm(cancellationFees: CancellationFees) {
    this.cancellationFeeForm.patchValue(cancellationFees);
  }

  public newCancellationFee() {
    this.showCancellationFeeForm();
    this.cancellationFeeForm.reset();
  }

  public saveCancellationFee(): void {
    this.cancellationFeeForm.markAllAsTouched();
    if(!this.cancellationFeeForm.valid) {
      return
    }
    const cancellationFee: CancellationFees = {...this.cancellationFeeForm.value, contractId: this.contractId}
    this.cancellationFeesService.saveCancellationFees(cancellationFee)
      .subscribe(() => this.getCancellationFees(this.contractId));
  }

  private hideCancellationFeeForm(): void {
    this.isCancellationFeeFormVisible = false;
  }

  private showCancellationFeeForm(): void {
    this.isCancellationFeeFormVisible = true;
  }

  public isContractSigned(): boolean {
    return this.contract?.contractState === ContractStates.SIGNED;
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.cancellationFeeForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.cancellationFeeForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
