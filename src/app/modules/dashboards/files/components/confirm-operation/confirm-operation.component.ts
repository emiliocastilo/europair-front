import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { environment } from 'src/environments/environment';
import { ConfirmOperation } from '../../models/File.model';
import { ConfirmOperationService } from '../../services/confirm-operation.service';
@Component({
  selector: 'app-confirm-operation',
  templateUrl: './confirm-operation.component.html',
  styleUrls: ['./confirm-operation.component.scss'],
})
export class ConfirmOperationComponent implements OnInit {
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  private readonly confirmOperationModal: ElementRef;

  public readonly observationMaxLength: number = 1500;
  public isLoading: boolean = false;
  private fileId: number;

  public operationForm: FormGroup = this.fb.group({
    flightMotive: [''],
    connections: [''],
    limitations: [''],
    fixedVariableFuel: [''],
    luggage: [''],
    specialLuggage: [''],
    onBoardService: [''],
    specialRequests: [''],
    otherCharges: [''],
    operationalInfo: [''],
    observation: ['']
  });


  constructor(
    private readonly modalService: ModalService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly confirmOperationService: ConfirmOperationService
  ) { }

  ngOnInit(): void {
    this.obtainParams();
    this.obtainOperation();
  }

  private obtainParams(): void {
    this.route.params.subscribe((params: { fileId: string }) => {
      this.fileId = parseInt(params.fileId, 10);
    });
  }

  private obtainOperation(): void {
    this.confirmOperationService.getConfirmOperations(this.fileId)
      .subscribe((operation: Page<ConfirmOperation>) => {
        if (operation.content.length > 0) {
          this.operationForm.patchValue(operation.content[0])
        }
      });
  }

  public openModalConfirmOperation(): void {
    this.modalService.initializeModal(this.confirmOperationModal, {
      dismissible: false,
    });
    this.modalService.openModal();
  }

  public saveAndConfirmObservations(): void {
    this.isLoading = true;
    this.operationForm.markAsTouched();
    if (!this.operationForm.valid) {
      this.operationForm.markAllAsTouched();
      return;
    }

    const observations: ConfirmOperation = {
      ...this.operationForm.value
    };

    this.confirmOperationService.updateConfirmOperation(this.fileId, observations).subscribe(() => {
      window.open(environment.powerAppUrl.confirmOperation, "_blank");
      this.router.navigate([this.getReturnRoute()]);
    });
  }

  public getReturnRoute(): string {
    return `/files/${this.fileId}`;
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.operationForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.operationForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
