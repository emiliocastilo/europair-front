import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Contract, ContractLine, ContractType } from '../../models/Contract.model';
import { FileRoute, RouteStatus } from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { ContractLineService } from '../../services/contract-line.service';
import { ContractsService } from '../../services/contracts.service';
import { FlightService } from '../../services/flight.service';

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
  public languageOptions: Array<{ id: number, name: string }> = [];
  public dateFormatsOptions: Array<{ id: number, name: string }> = [];
  public paymentConditionsOptions: Array<{ id: number, name: string }> = [];

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
    language: [''],
    dateFormat: [''],
    paymentConditions: [''],
    paymentConditionsObservations: [''],
    deposit: [''],
    expiration: ['']
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly contractsService: ContractsService,
    private readonly contractLineService: ContractLineService,
    private readonly flightService: FlightService,
    @Inject(LOCALE_ID) locale: string
  ) {
    this.datePipe = new DatePipe(locale);
  }

  ngOnInit(): void {
    this.getContractInfo();
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

  private loadFlightsByFile() {
    this.flightService.getFlightsByFile(this.fileId, { 'filter_route.routeState': RouteStatus.WON })
      .subscribe((pageFlight: Page<Flight>) => {
        this.flightsDataSource = new MatTableDataSource<Flight>(pageFlight.content);
      });
  }

  private loadContract() {
    this.contractsService
      .getContract(this.fileId, this.contractId)
      .subscribe((contract: Contract) => {
        this.contract = contract;
        this.title = `FILES_CONTRACT.DETAIL_TITLE_${contract.contractType}`;
        this.contractDataForm.patchValue({
          contractDate: this.datePipe.transform(contract.contractDate, 'yyyy-MM-dd'),
          contractSignDate: this.datePipe.transform(contract.signatureDate, 'yyyy-MM-dd'),
          contractState: this.translateService.instant(`FILES_CONTRACT.CONTRACT_STATE.${contract.contractState}`),
          provider: contract.provider?.name,
          client: contract.client?.name
        });
        this.contractLinesDataSource = new MatTableDataSource<ContractLine>(contract.contractLines);
        this.refreshLinesData();
        this.updateChangesContract();
      });
  }

  private updateChangesContract(): void {
    this.contractDataForm.get('contractDate').valueChanges.subscribe((value: string) => {
      this.contractsService.updateContract(this.fileId, { id: this.contract.id, contractDate: value}).subscribe(() => this.loadContract());
    });
    this.contractDataForm.get('signatureDate').valueChanges.subscribe((value: string) => {
      this.contractsService.updateContract(this.fileId, { id: this.contract.id, contractDate: value}).subscribe(() => this.loadContract());
    });
  }

  private refreshLinesData() {
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
      this.contractLineService
        .updateContractLine(
          this.fileId,
          this.getContractLinePriceUpdated(this.contract.contractLines[index], control)
        )
        .subscribe((_) => this.refreshScreenData());
    }
  }

  private getContractLinePriceUpdated(contractLine: ContractLine, control: FormControl): ContractLine {
    return {
      ...contractLine,
      price: control.value,
    };
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

  public hasControlAnyError(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return control && control.hasError(errorName);
  }
}
