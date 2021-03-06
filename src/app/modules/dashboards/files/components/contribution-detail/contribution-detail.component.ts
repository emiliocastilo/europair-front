import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  ContributionLine,
  CURRENCIES,
  Currency,
  LineContributionRouteType,
  RotationContributionLine,
} from '../../models/ContributionLine.model';
import {
  Services,
  ServiceType,
} from '../../../masters/services/models/services.model';
import { ContributionLineService } from '../../services/contribution-line.service';
import { ContributionService } from '../../services/contribution.service';
import { FileRoutesService } from '../../services/file-routes.service';
import { ServicesService } from '../../../masters/services/services/services.service';
import {
  Contribution,
  ContributionOperations,
  ContributionStates,
  CONTRIBUTION_STATES,
} from '../search-aircraft/models/contribution.model';

@Component({
  selector: 'app-contribution-detail',
  templateUrl: './contribution-detail.component.html',
  styleUrls: ['./contribution-detail.component.scss'],
})
export class ContributionDetailComponent implements OnInit {
  @ViewChild('purchasePanel') purchasePanel: MatExpansionPanel;
  @ViewChild('salePanel') salePanel: MatExpansionPanel;
  public fileId: number;
  public routeId: number;
  public contributionId: number;
  public contribution: Contribution;
  private rotationsLabelMap: Map<number, string> = new Map();
  public purchasePriceControls: FormArray;
  public salePriceControls: FormArray;
  public purchaseRotationContributionLines: RotationContributionLine[] = [];
  public purchaseRotationLinesTotalAmount: number = 0;
  public purchaseServiceContributionLines: ContributionLine[] = [];
  public purchaseServiceLinesTotalAmount: number = 0;
  public saleRotationContributionLines: RotationContributionLine[] = [];
  public saleRotationLinesTotalAmount: number = 0;
  public saleServiceContributionLines: ContributionLine[] = [];
  public saleServiceLinesTotalAmount: number = 0;
  public rotationsColumnsToDisplay = ['rotation', 'price', 'actions'];
  public servicesColumnsToDisplay = [
    'service',
    'quantity',
    'servicePrice',
    'observation',
    'actions',
  ];
  public currencies: Currency[];
  public isVisibleButtonNewPurchaseService: boolean = true;
  public isVisibleButtonNewSaleService: boolean = true;
  public services$: Observable<Services[]>;
  public servicesInput$ = new Subject<string>();
  public servicesLoading = false;
  private datePipe: DatePipe;
  public conributionStates = CONTRIBUTION_STATES;
  public CONTRIBUTION_OPERATIONS = ContributionOperations;

  public purchaseServiceForm = this.fb.group({
    type: ['', Validators.required],
    quantity: ['', Validators.required],
    price: ['', Validators.required],
    comments: [''],
  });
  public saleServiceForm = this.fb.group({
    type: ['', Validators.required],
    quantity: ['', Validators.required],
    price: ['', Validators.required],
    comments: [''],
  });

  public purchaseContributionForm = this.fb.group({
    purchasePrice: [0],
    currency: [''],
    taxes: [{ value: 0 }],
    taxesPrice: [{ value: 0 }],
    observation: [''],
  });
  public saleContributionForm = this.fb.group({
    salesPrice: [0],
    currencyOnSale: [''],
    taxes: [{ value: 0 }],
    taxesPrice: [{ value: 0 }],
    observation: [''],
  });

  public contributionStateControl = this.fb.control(null);

  public contributionDataForm = this.fb.group({
    operator: [{ value: '', disabled: true}],
    aircraftType: [{ value: '', disabled: true}],
    totalPassengers: [{ value: '', disabled: true}],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly servicesService: ServicesService,
    private readonly contributionService: ContributionService,
    private readonly contributionLineService: ContributionLineService,
    private readonly routesService: FileRoutesService,
    @Inject(LOCALE_ID) locale: string
  ) {
    this.datePipe = new DatePipe(locale);
  }

  ngOnInit(): void {
    this.getRouteInfo();
    this.loadSelectData();
    this.controlSubscribes();
    this.onChangeContributionState();
  }

  private getRouteInfo() {
    this.route.paramMap.subscribe((params) => {
      this.fileId = +params.get('fileId');
      this.routeId = +params.get('routeId');
      this.contributionId = +params.get('contributionId');
      this.refreshScreenData();
    });
  }

  private refreshScreenData() {
    this.refreshContributionData();
    this.routesService
      .getFileRouteById(this.fileId, this.routeId)
      .pipe(
        map((route) => route.rotations),
        tap((rotations) =>
          rotations.map((rotation) =>
            this.rotationsLabelMap.set(
              rotation.id,
              `${rotation.label} ${this.datePipe.transform(
                rotation.endDate,
                'dd/MM/yyyy'
              )}`
            )
          )
        )
      )
      .subscribe((rotations) => {
        this.refreshPurchaseData();
        this.refreshSaleData();
      });
  }

  private refreshContributionData() {
    this.contributionService
      .getContribution(this.fileId, this.routeId, this.contributionId)
      .pipe(
        tap((contribution) => (this.contribution = contribution)),
        tap(this.updateContributionDataForm),
        tap(this.updateContributionStateControl)
      )
      .subscribe((contribution: Contribution) =>
        this.updateContributionForms(contribution)
      );
  }

  private updateContributionDataForm = (contribution: Contribution): void => {
    this.contributionDataForm.setValue(this.createContributionDataFormFromContribution(contribution));
  }

  private createContributionDataFormFromContribution(contribution: Contribution) {
    return {
      operator: contribution.operator.name,
      aircraftType: contribution.aircraft.aircraftType.code,
      totalPassengers: contribution.seatingC + contribution.seatingF + contribution.seatingY
    }
  }

  private updateContributionStateControl = (
    contribution: Contribution
  ): void => {
    this.contributionStateControl.setValue(contribution.contributionState, {
      emitEvent: false,
    });
  };

  private onChangeContributionState() {
    this.contributionStateControl.valueChanges.subscribe(
      (newState: ContributionStates) => this.updateContributionState(newState)
    );
  }

  private updateContributionState(newState: ContributionStates) {
    this.contributionService
      .updateContributionsState(
        this.fileId,
        this.routeId,
        this.contribution,
        newState
      )
      .pipe(finalize(() => this.refreshContributionData()))
      .subscribe();
  }

  private updateContributionForms(contribution: Contribution) {
    this.purchaseContributionForm.reset({
      purchasePrice: this.maskPrice(contribution.purchasePrice),
      currency: contribution.currency,
      taxes: contribution.purchaseCommissionPercent,
      taxesPrice: contribution.vatAmountOnPurchase,
      observation: contribution.purchaseComments,
    });
    this.saleContributionForm.reset({
      salesPrice: this.maskPrice(contribution.salesPrice),
      currencyOnSale: contribution.currencyOnSale,
      taxes: contribution.salesCommissionPercent,
      taxesPrice: contribution.vatAmountOnSale,
      observation: contribution.salesComments,
    });
  }

  private refreshPurchaseData() {
    this.contributionLineService
      .getPurchaseContributionLines(
        this.fileId,
        this.routeId,
        this.contributionId
      )
      .pipe(map((page) => page.content))
      .subscribe((lines) => {
        const flightLines = this.getFlightLines(lines);
        this.purchaseServiceContributionLines = this.getServicesLines(lines);
        this.purchaseServiceForm
          .get('type')
          .setValidators([
            Validators.required,
            this.getTypeServicesNotRepeatedValidator(
              this.purchaseServiceContributionLines
            ),
          ]);
        this.purchaseServiceForm.get('type').updateValueAndValidity();
        this.purchaseRotationLinesTotalAmount = this.contributionLineService.getTotalPrice(
          flightLines
        );
        this.purchaseServiceLinesTotalAmount = this.contributionLineService.getTotalPrice(
          this.purchaseServiceContributionLines
        );
        this.purchaseRotationContributionLines = this.createRotationsLines(
          flightLines
        );
        this.purchasePriceControls = new FormArray(
          this.purchaseRotationContributionLines.map(this.createPriceControls)
        );
      });
  }

  private refreshSaleData() {
    this.contributionLineService
      .getSaleContributionLines(this.fileId, this.routeId, this.contributionId)
      .pipe(map((page) => page.content))
      .subscribe((lines) => {
        const flightLines = this.getFlightLines(lines);
        this.saleServiceContributionLines = this.getServicesLines(lines);
        this.saleServiceForm
          .get('type')
          .setValidators([
            Validators.required,
            this.getTypeServicesNotRepeatedValidator(
              this.saleServiceContributionLines
            ),
          ]);
        this.saleServiceForm.get('type').updateValueAndValidity();
        this.saleRotationLinesTotalAmount = this.contributionLineService.getTotalPrice(flightLines);
        this.saleServiceLinesTotalAmount = this.contributionLineService.getTotalPrice(
          this.saleServiceContributionLines
        );
        this.saleRotationContributionLines = this.createRotationsLines(
          flightLines
        );
        this.salePriceControls = new FormArray(
          this.saleRotationContributionLines.map(this.createPriceControls)
        );
      });
  }

  private createRotationsLines(
    lines: ContributionLine[]
  ): RotationContributionLine[] {
    return lines.map((line: ContributionLine) => ({
      contributionLine: line,
      rotation: this.createRotationLabel(line),
      price: line.price,
    }));
  }

  private createRotationLabel(line: ContributionLine): string {
    return this.rotationsLabelMap.get(line.routeId) ?? '';
  }

  private getFlightLines(lines: ContributionLine[]) {
    return lines.filter(
      (line: ContributionLine) => line.type === ServiceType.FLIGHT
    );
  }

  private getServicesLines(lines: ContributionLine[]): ContributionLine[] {
    return lines.filter(
      (line: ContributionLine) => line.type !== ServiceType.FLIGHT
    );
  }

  private createPriceControls = (
    rotationPurchaseContributionLine: RotationContributionLine
  ): FormGroup => {
    return new FormGroup({
      price: new FormControl(rotationPurchaseContributionLine.price),
    });
  };

  private loadSelectData(): void {
    this.loadServices();
    this.loadCurrencies();
  }

  private loadServices(): void {
    this.services$ = concat(
      of([]), // default items
      this.servicesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.servicesLoading = true)),
        switchMap((term: string) =>
          this.servicesService.getServices({ filter_name: term }).pipe(
            map((page: Page<Services>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.servicesLoading = false))
          )
        )
      )
    );
  }

  private loadCurrencies(): void {
    this.currencies = CURRENCIES.map((currency: Currency) => ({
      ...currency,
      description: this.translateService.instant(currency.description),
    }));
  }

  private controlSubscribes() {
    this.purchaseContributionForm
      .get('purchasePrice')
      .valueChanges.subscribe((value) =>
        this.setTaxesPrice(this.purchaseContributionForm, value, ContributionOperations.PURCHASE)
      );
      this.purchaseContributionForm
      .get('taxes')
      .valueChanges.subscribe((value) =>
        this.setTaxesPriceOnChangeTaxes(this.purchaseContributionForm, value, 'purchasePrice', ContributionOperations.PURCHASE)
      );
    this.saleContributionForm
      .get('salesPrice')
      .valueChanges.subscribe((value) =>
        this.setTaxesPrice(this.saleContributionForm, value, ContributionOperations.SALE)
      );
      this.saleContributionForm
      .get('taxes')
      .valueChanges.subscribe((value) =>
        this.setTaxesPriceOnChangeTaxes(this.saleContributionForm, value, 'salesPrice', ContributionOperations.SALE)
      );
  }

  private setTaxesPriceOnChangeTaxes(form: FormGroup, stringValue: string, formControlName: string, operationType: ContributionOperations) {
    const totalPrice = this.unmaskPrice(form.get(formControlName).value);
    const taxes = Number.parseInt(stringValue);
    form.get('taxesPrice').setValue(this.getTaxesPrice(totalPrice, taxes, operationType));
  }

  private setTaxesPrice(form: FormGroup, stringValue: string, operationType: ContributionOperations) {
    const totalPrice = this.unmaskPrice(stringValue);
    const taxes = Number.parseInt(form.get('taxes').value);
    form.get('taxesPrice').setValue(this.getTaxesPrice(totalPrice, taxes, operationType));
  }

  private getTaxesPrice(totalPrice: number, taxes: number, operationType: ContributionOperations) {
    if (taxes && totalPrice) {
      const totalPriceUnderTaxes = this.getTotalPriceUnderTaxes(totalPrice, operationType)
      const taxesPriceValue = totalPriceUnderTaxes - totalPriceUnderTaxes / (1 + taxes / 100);
      return taxesPriceValue.toFixed(2);
    } else {
      return 0;
    }
  }

  private getTotalPriceUnderTaxes(totalPrice: number, operationType: ContributionOperations) {
    return  totalPrice * (this.getPercentageApplied(operationType)/100);
  }

  private getPercentageApplied(operationType: ContributionOperations) {
    return operationType === ContributionOperations.PURCHASE? 
    this.contribution?.percentage_applied_on_purchase_tax ?? 100 : 
    this.contribution?.percentage_applied_on_sale_tax ?? 100;
  }

  public updateContributionPurchaseData() {
    this.contributionService
      .updateContribution(this.fileId, this.routeId, {
        ...this.contribution,
        purchasePrice: this.unmaskPrice(
          this.purchaseContributionForm.value.purchasePrice
        ),
        currency: this.purchaseContributionForm.value.currency,
        purchaseComments: this.purchaseContributionForm.value.observation,
        purchaseCommissionPercent: this.purchaseContributionForm.value.taxes,
        vatAmountOnPurchase: this.purchaseContributionForm.value.taxesPrice,
      })
      .subscribe((contribution) => this.updateContributionForms(contribution));
  }

  public updateContributionSaleData() {
    this.contributionService
      .updateContribution(this.fileId, this.routeId, {
        ...this.contribution,
        salesPrice: this.unmaskPrice(
          this.saleContributionForm.value.salesPrice
        ),
        currencyOnSale: this.saleContributionForm.value.currencyOnSale,
        salesComments: this.saleContributionForm.value.observation,
        salesCommissionPercent: this.saleContributionForm.value.taxes,
        vatAmountOnSale: this.saleContributionForm.value.taxesPrice,
      })
      .subscribe((contribution) => this.updateContributionForms(contribution));
  }

  public updatePurchasePrice(index: number, field: string) {
    const control = this.getControl(this.purchasePriceControls, index, field);
    if (control.valid && control.dirty) {
      this.contributionLineService
        .updateContributionLine(
          this.fileId,
          this.routeId,
          this.contributionId,
          this.getContributionLinePriceUpdated(
            this.purchaseRotationContributionLines[index],
            control
          )
        )
        .subscribe((_) => this.refreshPurchaseData());
    }
  }

  public updateSalePrice(index: number, field: string) {
    const control = this.getControl(this.salePriceControls, index, field);
    if (control.valid && control.dirty) {
      this.contributionLineService
        .updateContributionLine(
          this.fileId,
          this.routeId,
          this.contributionId,
          this.getContributionLinePriceUpdated(
            this.saleRotationContributionLines[index],
            control
          )
        )
        .subscribe((_) => this.refreshSaleData());
    }
  }

  public getControl(
    controlsArray: FormArray,
    index: number,
    fieldName: string
  ): FormControl {
    return controlsArray.at(index).get(fieldName) as FormControl;
  }

  private getContributionLinePriceUpdated(
    rotationContributionLine: RotationContributionLine,
    control: FormControl
  ): ContributionLine {
    return {
      ...rotationContributionLine.contributionLine,
      price: control.value,
    };
  }

  public newPurchaseService() {
    this.isVisibleButtonNewPurchaseService = false;
  }

  public addPurchaseService() {
    if (!this.purchaseServiceForm.valid) {
      this.purchaseServiceForm.markAllAsTouched();
      return;
    }
    this.contributionLineService
      .createPurchaseContributionLine(
        this.fileId,
        this.routeId,
        this.contributionId,
        this.purchaseServiceForm.value
      )
      .subscribe((id) => {
        this.isVisibleButtonNewPurchaseService = true;
        this.purchaseServiceForm.reset();
        this.refreshPurchaseData();
      });
  }

  public newSaleService() {
    this.isVisibleButtonNewSaleService = false;
  }

  public addSaleService() {
    if (!this.saleServiceForm.valid) {
      this.saleServiceForm.markAllAsTouched();
      return;
    }
    this.contributionLineService
      .createSaleContributionLine(
        this.fileId,
        this.routeId,
        this.contributionId,
        this.saleServiceForm.value
      )
      .subscribe((id) => {
        this.isVisibleButtonNewSaleService = true;
        this.saleServiceForm.reset();
        this.refreshSaleData();
      });
  }

  public deleteService(service: ContributionLine) {
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'CONTRIBUTIONS.DELETE_SERVICE_TITLE',
          message: 'CONTRIBUTIONS.DELETE_SERVICE_MSG',
          translationParams: {
            type: service.type,
            price: service.price,
          },
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contributionLineService
          .deleteContributionLine(
            this.fileId,
            this.routeId,
            this.contributionId,
            service
          )
          .subscribe((_) => {
            if (
              service.lineContributionRouteType ===
              LineContributionRouteType.PURCHASE
            ) {
              this.refreshPurchaseData();
            } else {
              this.refreshSaleData();
            }
          });
      }
    });
  }

  public copyPurchaseToSale(event: Event) {
    event.stopPropagation();
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'COMMON.CONFIRM_OPERATION',
          message: 'CONTRIBUTIONS.OVERWRITE_SALES_MSG',
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contributionLineService
          .generateContributionSaleLines(
            this.fileId,
            this.routeId,
            this.contributionId
          )
          .subscribe((_) => {
            this.refreshScreenData();
            this.purchasePanel.close();
            this.salePanel.open();
          });
      }
    });
  }

  public hasContributionPercentageApplied(operationType: ContributionOperations) {
    return this.getPercentageApplied(operationType) !== 100;
  }

  public hasControlAnyError(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    form: FormGroup,
    controlName: string,
    errorName: string
  ): boolean {
    const control = form.get(controlName);
    return control && control.hasError(errorName);
  }

  private maskPrice(price: number): string {
    return (
      price
        ?.toString()
        ?.replace('.', ',')
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'
    );
  }

  private unmaskPrice(price: string): number {
    return +price?.replace(/\./g, '')?.replace(',', '.') ?? 0;
  }

  private getTypeServicesNotRepeatedValidator(
    lines: ContributionLine[]
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return lines.find((line) => line.type === control.value)
        ? { serviceRepeated: { value: control.value } }
        : null;
    };
  }
}
