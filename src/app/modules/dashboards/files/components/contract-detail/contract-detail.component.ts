import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { TimeZone } from 'src/app/core/models/base/time-zone';
import { Page } from 'src/app/core/models/table/pagination/page';
import { TimeConversionService } from 'src/app/core/services/time-conversion.service';
import { Contract, ContractLine, ContractStates, ContractType } from '../../models/Contract.model';
import { FileRoute, RouteStatus } from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { ContractLineService } from '../../services/contract-line.service';
import { ContractsService } from '../../services/contracts.service';
import { FlightService } from '../../services/flight.service';
import { CONTRACT_HOURS_CONFIG } from './models/contract-configuration.model';
import { ContractPaymentCondition } from './models/contract-payment-condition';
import { ContractConfigurationService } from './services/contract-configuration.service';
import { ContractPaymentConditionService } from './services/contract-payment-condition.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit {
  public title: string;
  public fileId: number;
  public contractId: number;
  public contract: Contract;
  public fileRoutes: Array<FileRoute>;
  public languageOptions: Array<string> = ['Español', 'Ingles'];
  public hoursFormatsOptions: any;
  public paymentConditionOptions: Array<ContractPaymentCondition> = [];
  public paymentConditionsOptions: Array<{ id: number, name: string }> = [];
  public CONTRACT_STATES = ContractStates;

  private datePipe: DatePipe;

  public contractLinesDataSource: MatTableDataSource<ContractLine> = new MatTableDataSource<ContractLine>();
  public flightsDataSource: MatTableDataSource<Flight> = new MatTableDataSource<Flight>();

  public contractLinesTotalAmount: number = 0;
  public priceControls: FormArray;

  public contractType = ContractType;
  public contractColumnsToDisplay: Array<string> = ['route_label', 'route_startDate', 'route_endDate', 'price'];
  public flightsColumnsToDisplay: Array<string> = ['date', 'origin', 'destination', 'departure', 'arrival', 'flight-number', 'aircraft', 'seats'];
  public contractDataForm = this.fb.group({
    contractDate: [''],
    contractSignDate: [''],
    contractState: [{ value: '', disabled: true }],
    provider: [{ value: '', disabled: true }],
    client: [{ value: '', disabled: true }]
  });

  public configurationDataForm = this.fb.group({
    id: [null],
    language: [''],
    timezone: [''],
    paymentConditionsId: [''],
    paymentConditionsObservation: [''],
    deposit: [''],
    depositExpirationDate: ['']
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly contractsService: ContractsService,
    private readonly contractPaymentConditionService: ContractPaymentConditionService,
    private readonly contractconfigurationService: ContractConfigurationService,
    private readonly contractLineService: ContractLineService,
    private readonly flightService: FlightService,
    private readonly matDialog: MatDialog,
    @Inject(LOCALE_ID) locale: string
  ) {
    this.datePipe = new DatePipe(locale);
    this.hoursFormatsOptions = CONTRACT_HOURS_CONFIG;
  }

  ngOnInit(): void {
    this.getContractInfo();
    this.obtainContractPaymentConditions();
    this.updateChangesContract();
  }

  private getContractInfo() {
    this.route.paramMap.subscribe((params) => {
      this.fileId = +params.get('fileId');
      this.contractId = +params.get('contractId');
      this.refreshScreenData();
    });
  }

  private refreshScreenData() {
    this.loadContract();
    this.loadFlightsByFile();
  }

  private loadContract() {
    this.contractsService
      .getContract(this.fileId, this.contractId)
      .subscribe((contract: Contract) => {
        this.contract = contract;
        this.title = `FILES_CONTRACT.DETAIL_TITLE_${contract.contractType}`;
        this.contractDataForm.patchValue({
          contractDate: this.datePipe.transform(contract.contractDate, 'yyyy-MM-dd') ?? '',
          contractSignDate: this.datePipe.transform(contract.signatureDate, 'yyyy-MM-dd') ?? '',
          contractState: this.translateService.instant(`FILES_CONTRACT.CONTRACT_STATE.${contract.contractState}`),
          provider: contract.provider?.name,
          client: contract.client?.name
        }, {emitEvent: false});
        this.contractLinesDataSource = new MatTableDataSource<ContractLine>(contract.contractLines);
        this.refreshLinesData();
        if (contract.contractConfiguration) {
          this.configurationDataForm.patchValue(contract.contractConfiguration);
        }
        if (this.isContractSigned()) {
          this.contractDataForm.disable({emitEvent: false});
          this.configurationDataForm.disable({emitEvent: false});
        } else {
          this.enableUpdatableData();
        }
      });
  }

  private enableUpdatableData() {
    this.contractDataForm.get('contractDate').enable({emitEvent: false});
    this.contractDataForm.get('contractSignDate').enable({emitEvent: false});
    this.configurationDataForm.enable({emitEvent: false});
  }

  private loadFlightsByFile() {
    this.flightService.getFlightsByFile(this.fileId, { 'filter_route.routeState': RouteStatus.WON })
      .subscribe((pageFlight: Page<Flight>) => {
        this.flightsDataSource = new MatTableDataSource<Flight>(pageFlight.content);
      });
  }

  private obtainContractPaymentConditions(): void {
    this.contractPaymentConditionService.getContractPaymentConditions({ size: '200' }).subscribe((pageConditions: Page<ContractPaymentCondition>) => this.paymentConditionOptions = pageConditions.content);
  }

  private updateChangesContract(): void {
    this.contractDataForm.get('contractDate').valueChanges
      .pipe(debounceTime(200))
      .subscribe((value: string) => {
      this.contractsService.updateContract(this.fileId, { id: this.contract.id, contractDate: `${value}T00:00:00`}).subscribe(() => this.loadContract());
    });
    this.contractDataForm.get('contractSignDate').valueChanges
      .pipe(debounceTime(200))
      .subscribe((value: string) => {
      this.contractsService.updateContract(this.fileId, { id: this.contract.id, signatureDate: `${value}T00:00:00`}).subscribe(() => this.loadContract());
    });
  }

  private refreshLinesData(): void {
    this.contractLinesTotalAmount = this.contractLineService.getTotalPrice(this.contract.contractLines);
    this.priceControls = new FormArray(
      this.contract.contractLines.map(this.createPriceControls)
    );
  }

  private createPriceControls = (contractLine: ContractLine): FormGroup => {
    return new FormGroup({ price: new FormControl(contractLine.price) });
  }

  public updatePrice(index: number, field: string) {
    const control = this.getControl(this.priceControls, index, field);
    if (control.valid && control.dirty) {
      this.contractLineService.updateContractLine(this.fileId, this.contractId, this.getContractLinePriceUpdated(this.contract.contractLines[index], control))
        .subscribe((_) => this.refreshScreenData());
    }
  }

  private getContractLinePriceUpdated(contractLine: ContractLine, control: FormControl): ContractLine {
    return {
      ...contractLine,
      price: control.value,
    };
  }

  public signContract() {
    const confirmOperationRef = this.matDialog.open(ConfirmOperationDialogComponent, {
      data: {
        title: 'FILES_CONTRACT.SIGN_CONTRACT_TITLE',
        message: 'FILES_CONTRACT.SIGN_CONTRACT_MSG',
        translationParams: { contractCode: this.contract?.code}
      }
    });
    confirmOperationRef.afterClosed().subscribe(result => {
      if(result) {
        this.contractsService.updateContractState(this.fileId, this.contract.id, ContractStates.SIGNED)
          .subscribe(() => this.refreshScreenData());
      }
    });
  }

  public copyContract() {
    const confirmOperationRef = this.matDialog.open(ConfirmOperationDialogComponent, {
      data: {
        title: 'FILES_CONTRACT.COPY_CONTRACT_TITLE',
        message: 'FILES_CONTRACT.COPY_CONTRACT_MSG',
        translationParams: { contractCode: this.contract?.code}
      }
    });
    confirmOperationRef.afterClosed().subscribe(result => {
      if(result) {
        this.contractsService.copyContract(this.fileId, this.contract.id)
          .subscribe((copyContractId) => this.router.navigate((['files', this.fileId, 'contracts', copyContractId])));
      }
    });
  }

  public saveConfiguration(): void {
    this.contractconfigurationService.saveContractConfiguration(this.fileId, this.contractId, this.configurationDataForm.value)
      .subscribe(() => this.refreshScreenData());
  }

  public isContractSigned(): boolean {
    return this.contract?.contractState === ContractStates.SIGNED;
  }

  public assignConditions(): void {
    this.router.navigate(['files', this.fileId, 'contracts', this.contractId, 'conditions']);
  }

  public cancellationsFees(): void {
    this.router.navigate(['files', this.fileId, 'contracts', this.contractId, 'cancellation-fees']);
  }

  public getControl(controlsArray: FormArray, index: number, fieldName: string): FormControl {
    return controlsArray.at(index).get(fieldName) as FormControl;
  }
}
