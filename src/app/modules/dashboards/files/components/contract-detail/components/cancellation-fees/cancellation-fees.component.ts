import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import { CancellationFees } from '../../models/cancellation-fees.model';
import { CancellationFeesService } from '../../services/cancellation-fees.service';

@Component({
  selector: 'app-cancellation-fees',
  templateUrl: './cancellation-fees.component.html',
  styleUrls: ['./cancellation-fees.component.scss'],
})
export class CancellationFeesComponent implements OnInit {
  public cancellationFees: Array<CancellationFees>;
  public contractId: number;
  public fileId: number;
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
  ) { }

  ngOnInit(): void {
    this.getRouteData();
  }

  private getRouteData() {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.getCancellationFees(this.contractId);
    });
  }

  private getCancellationFees(contractId: number): void {
    this.cancellationFeesService.getCancellationFees({ 'filter_contract.id': contractId.toString() })
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
        title: 'ROTATIONS.DELETE_FLIGHT_TITLE',
        message: 'ROTATIONS.DELETE_FLIGHT_MSG',
        translationParams: {}
      }
    });
    confirmOperationRef.afterClosed().subscribe(result => {
      if(result) {
        //TODO DELETE
        // this.flightService.deleteFlight(this.fileId, this.rotationId, flight).subscribe(_ => this.refreshScreenData());
        this.getCancellationFees(this.contractId);
      }
    });
  }

  public onCancellationFeeSelected(cancellationFees: CancellationFees) {
    this.selection.toggle(cancellationFees);
    // this.selectedFlight = this.selection.isEmpty()? undefined : flight;
    if(this.selection.isEmpty()) {
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
    //TODO SAVE (CREATE OR UPDATE)
    this.getCancellationFees(this.contractId);
  }

  private hideCancellationFeeForm(): void {
    this.isCancellationFeeFormVisible = false;
  }

  private showCancellationFeeForm(): void {
    this.isCancellationFeeFormVisible = true;
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
