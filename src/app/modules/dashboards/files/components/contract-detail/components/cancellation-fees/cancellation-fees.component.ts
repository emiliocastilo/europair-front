import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
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

  public cancellationFeesForm: FormArray;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly cancellationFeesService: CancellationFeesService
  ) { }

  ngOnInit(): void {
    this.getCancellationFees();
  }

  private getCancellationFees(): void {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.cancellationFeesService.getCancellationFees({ 'filter_contract.id': params.contractId })
        .subscribe((page: Page<CancellationFees>) => {
          this.cancellationFees = page.content;
          this.cancellationFeesForm = new FormArray(
            this.cancellationFees.map(this.createPriceControls)
          );
        });
    });
  }

  private createPriceControls = (cancellationFees: CancellationFees): FormGroup => {
    return this.fb.group({
      id: [cancellationFees.id],
      fromValue: [cancellationFees.fromValue, [Validators.required, Validators.min(0)]],
      fromUnit: [cancellationFees.fromUnit, Validators.required],
      feePercentage: [cancellationFees.feePercentage, [Validators.required, Validators.min(0)]]
    });
  }

  public deleteForm(indexFormGroup: number): void {
    this.cancellationFeesForm.removeAt(indexFormGroup);
  }

  public addLineForm(): void {
    this.cancellationFeesForm.push(this.fb.group({
      fromValue: ['', [Validators.required, Validators.min(0)]],
      fromUnit: ['', Validators.required],
      feePercentage: ['', [Validators.required, Validators.min(0)]]
    }))
  }

  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }
}
