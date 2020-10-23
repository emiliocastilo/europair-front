import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmOperation } from '../../models/File.model';
import { ConfirmOperationService } from '../../services/confirm-operation.service';
@Component({
  selector: 'app-confirm-operation',
  templateUrl: './confirm-operation.component.html',
  styleUrls: ['./confirm-operation.component.scss'],
})
export class ConfirmOperationComponent implements OnInit {
  public readonly observationMaxLength: number = 5000;
  public isLoading: boolean = false;
  private fileId: number;

  public operationForm: FormGroup = this.fb.group({
    flightReason: [''],
    conections: [''],
    flightLimitation: [''],
    fuel: [''],
    equipment: [''],
    especialEquipment: [''],
    serviceOnBoard: [''],
    specialRequest: [''],
    otherCharges: [''],
    operative: [''],
    observations: ['']
  });


  constructor(
    private readonly route: ActivatedRoute,
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
      .subscribe((operation: ConfirmOperation) => this.operationForm.patchValue(operation));
  }

  public saveObservations() {
    this.isLoading = true;
    this.operationForm.markAsTouched();
    if (!this.operationForm.valid) {
      this.operationForm.markAllAsTouched();
      return;
    }

    const observations = {
      ...this.operationForm.value
    };
    /*
    this.additionalServicesService.createAdditionalService(this.fileId, this.rotationId, additionalService)
      .subscribe(() => {
        this.router.navigate([this.getReturnRoute()]);
        this.isLoading = false;
      }, () => this.isLoading = false, () => this.isLoading = false);
      */
  }

  public getReturnRoute() {
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

  public isControlDisabled(controlName: string): boolean {
    const control = this.operationForm.get(controlName);
    return control?.disabled;
  }
}
