import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
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
  ServiceTypeEnum,
} from '../../models/ContributionLine.model';
import { Services } from '../../models/Services.model';
import { ContributionLineService } from '../../services/contribution-line.service';
import { ContributionService } from '../../services/contribution.service';
import { FileRoutesService } from '../../services/file-routes.service';
import { ServicesService } from '../../services/services.service';
import { Contribution } from '../search-aircraft/models/contribution.model';

@Component({
  selector: 'app-contribution-detail',
  templateUrl: './contribution-detail.component.html',
  styleUrls: ['./contribution-detail.component.scss'],
})
export class ContributionDetailComponent implements OnInit {
  public fileId: number;
  private routeId: number;
  private contributionId: number;
  private contribution: Contribution;
  private rotationsLabelMap: Map<number, string> = new Map();
  public purchasePriceControls: FormArray;
  public salePriceControls: FormArray;
  public purchaseRotationContributionLines: RotationContributionLine[] = [];
  public purchaseServiceContributionLines: ContributionLine[] = [];
  public saleRotationContributionLines: RotationContributionLine[] = [];
  public saleServiceContributionLines: ContributionLine[] = [];
  public rotationsColumnsToDisplay = ['rotation', 'price'];
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
    taxes: [{ value: 0, disabled: true }],
    taxesPrice: [{ value: 0, disabled: true }],
    observation: [''],
  });
  public saleContributionForm = this.fb.group({
    salesPrice: [0],
    currencyOnSale: [''],
    taxes: [{ value: 0, disabled: true }],
    taxesPrice: [{ value: 0, disabled: true }],
    observation: [''],
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
      .pipe(tap((contribution) => (this.contribution = contribution)))
      .subscribe((contribution: Contribution) =>
        this.updateContributionForms(contribution)
      );
  }

  private updateContributionForms(contribution: Contribution) {
    this.purchaseContributionForm.reset({
      purchasePrice: contribution.purchasePrice,
      currency: contribution.currency,
      taxes: contribution.purchaseCommissionPercent,
      taxesPrice: this.getTaxesPrice(
        contribution.purchasePrice,
        contribution.purchaseCommissionPercent
      ),
      observation: contribution.purchaseComments,
    });
    this.saleContributionForm.reset({
      salesPrice: contribution.salesPrice,
      currencyOnSale: contribution.currencyOnSale,
      taxes: contribution.salesCommissionPercent,
      taxesPrice: this.getTaxesPrice(
        contribution.salesPrice,
        contribution.salesCommissionPercent
      ),
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
        this.purchaseRotationContributionLines = this.createRotationsLines(
          lines
        );
        this.purchasePriceControls = new FormArray(
          this.purchaseRotationContributionLines.map(this.createPriceControls)
        );
        this.purchaseServiceContributionLines = this.getServicesLines(lines);
      });
  }

  private refreshSaleData() {
    this.contributionLineService
      .getSaleContributionLines(this.fileId, this.routeId, this.contributionId)
      .pipe(map((page) => page.content))
      .subscribe((lines) => {
        this.saleRotationContributionLines = this.createRotationsLines(lines);
        this.salePriceControls = new FormArray(
          this.saleRotationContributionLines.map(this.createPriceControls)
        );
        this.saleServiceContributionLines = this.getServicesLines(lines);
      });
  }

  private createRotationsLines(
    lines: ContributionLine[]
  ): RotationContributionLine[] {
    return lines
      .filter((line: ContributionLine) => line.type === ServiceTypeEnum.FLIGHT)
      .map((line: ContributionLine) => ({
        contributionLine: line,
        rotation: this.createRotationLabel(line),
        price: line.price,
      }));
  }

  private createRotationLabel(line: ContributionLine): string {
    return this.rotationsLabelMap.get(line.routeId) ?? '';
  }

  private getServicesLines(lines: ContributionLine[]): ContributionLine[] {
    return lines.filter(
      (line: ContributionLine) => line.type !== ServiceTypeEnum.FLIGHT
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
        this.setTaxesPrice(this.purchaseContributionForm, value)
      );
    this.saleContributionForm
      .get('salesPrice')
      .valueChanges.subscribe((value) =>
        this.setTaxesPrice(this.saleContributionForm, value)
      );
  }

  private setTaxesPrice(form: FormGroup, stringValue: string) {
    const totalPrice = Number.parseInt(stringValue);
    const taxes = Number.parseInt(form.get('taxes').value);
    form.get('taxesPrice').setValue(this.getTaxesPrice(totalPrice, taxes));
  }

  private getTaxesPrice(totalPrice: number, taxes: number) {
    if (taxes && totalPrice) {
      const taxesPriceValue = totalPrice - totalPrice / (1 + taxes / 100);
      return taxesPriceValue.toFixed(2);
    } else {
      return 0;
    }
  }

  public updateContributionPurchaseData() {
    this.contributionService
      .updateContribution(this.fileId, this.routeId, {
        ...this.contribution,
        purchasePrice: this.purchaseContributionForm.value.purchasePrice,
        currency: this.purchaseContributionForm.value.currency,
        purchaseComments: this.purchaseContributionForm.value.observation,
      })
      .subscribe((contribution) => this.updateContributionForms(contribution));
  }

  public updateContributionSaleData() {
    this.contributionService
      .updateContribution(this.fileId, this.routeId, {
        ...this.contribution,
        salesPrice: this.saleContributionForm.value.salesPrice,
        currencyOnSale: this.saleContributionForm.value.currencyOnSale,
        salesComments: this.saleContributionForm.value.observation,
      })
      .subscribe((contribution) => this.updateContributionForms(contribution));
  }

  public updatePurchasePrice(index: number, field: string) {
    const control = this.getControl(this.purchasePriceControls, index, field);
    if (control.valid && control.dirty) {
      console.log(
        'MODIFICANDO',
        this.purchaseRotationContributionLines[index],
        control.value
      );
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
      console.log(
        'MODIFICANDO',
        this.saleRotationContributionLines[index],
        control.value
      );
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
            this.refreshSaleData();
          });
      }
    });
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
}
