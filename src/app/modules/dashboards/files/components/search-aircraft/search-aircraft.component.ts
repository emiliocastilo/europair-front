import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, forkJoin, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { Country } from '../../../masters/countries/models/country';
import { CountriesService } from '../../../masters/countries/services/countries.service';
import { FleetCategoriesService } from '../../../masters/fleet/components/fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../masters/fleet/components/fleet-categories/services/fleet-subcategories.service';
import { FleetTypesService } from '../../../masters/fleet/components/fleet-types/services/fleet-types.service';
import { FleetCategory, FleetSubcategory, FleetType } from '../../../masters/fleet/models/fleet';
import { Operator } from '../../../masters/operators/models/Operator.model';
import { OperatorsService } from '../../../masters/operators/services/operators.service';
import { AircraftFilter, TypeFilterSeat } from './models/aircraft-filter.model';
import { AircraftSearchResult } from './models/aircraft-search.model';
import { AircraftSearchService } from './services/aircraft-search.service';
import { ContributionService } from '../../services/contribution.service';
import { Contribution, ContributionStates } from './models/contribution.model';
import { Region } from '../../../masters/regions/models/region';
import { RegionsService } from '../../../masters/regions/services/regions.service';
import { OperationType } from '../../../masters/contacts/models/contact';
import { MatPaginator } from '@angular/material/paginator';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/Flight.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-aircraft',
  templateUrl: './search-aircraft.component.html',
  styleUrls: ['./search-aircraft.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class SearchAircraftComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public countries$: Observable<Country[]>;
  public countriesInput$ = new Subject<string>();
  public countriesLoading = false;
  public countryIdSelected: string;

  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;

  public regions: Array<Region>;

  public categories: Array<FleetCategory>;
  public subcategories: Array<FleetSubcategory>;
  public categoryIdSelected: string;

  public fleetTypes$: Observable<FleetType[]>;
  public fleetTypesInput$ = new Subject<string>();
  public fleetTypesLoading = false;

  public operators$: Observable<Operator[]>;
  public operatorsInput$ = new Subject<string>();
  public operatorsLoading = false;

  public seatFilterType: Array<{value: string, description: string}>;

  public searchForm: FormGroup = this.fb.group({
    regions: [[]],
    countries: [[]],
    airports: [[], this.validatorRequiredNearbyAirport.bind(this)],
    nearbyAirport: [false],
    nearbyAirportFrom: ['0', [this.validatorRequiredNearbyAirport.bind(this), this.validatorMaxValueNearbyAirportFrom.bind(this), Validators.min(0)]],
    nearbyAirportTo: ['100', [this.validatorRequiredNearbyAirport.bind(this), Validators.min(0)]],
    category: [''],
    subcategory: [''],
    minimunSubcategory: [true],
    fleetTypes: [[]],
    operators: [[]],
    filterSeat: [TypeFilterSeat.TOTAL_PAX],
    seatF: ['', Validators.min(0)],
    seatC: ['', Validators.min(0)],
    seatY: ['', Validators.min(0)],
    beds: ['', Validators.min(0)],
    stretchers: ['', Validators.min(0)],
    flightScales: [false],
    flightScalesValue: ['1', Validators.min(0)]
  });

  private unsubscriber$: Subject<void> = new Subject();

  public aircrafts: Array<AircraftSearchResult>;
  public dataSource: MatTableDataSource<AircraftSearchResult>;
  public resultsLength: number = 0;
  public pageSize: number = 10;
  public columnsToDisplay: Array<string>;

  public filterExpanded: boolean;
  public tableExpanded: boolean;

  private selectedItems: Array<number>;
  private aircraftSearch: AircraftFilter;

  private fileId: number;
  private routeId: number;
  private operationType: OperationType;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly regionsService: RegionsService,
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService,
    private readonly categoriesService: FleetCategoriesService,
    private readonly subcategoriesService: FleetSubcategoriesService,
    private readonly fleetTypeService: FleetTypesService,
    private readonly operatorsService: OperatorsService,
    private readonly searchAircraftService: AircraftSearchService,
    private readonly contributionService: ContributionService,
    private readonly flightService: FlightService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.init();
    this.loadSelectsData();
    this.obtainParams();
    this.initGeneralDataFormSubscriptions();
  }

  private init() {
    this.aircrafts = [];
    this.filterExpanded = true;
    this.tableExpanded = false;
    this.seatFilterType = this.itemsSelectSeatFilter();
    this.columnsToDisplay = ['selection', 'operator', 'dateAOC', 'fleetType', 'subcategory', 'flightTime', 'connectionFlights', 'insuranceDate', 'airport', 'category', 'quantity', 'seats', 'bedsAndStretchers', 'maximumLoad', 'observations'];
  }

  private itemsSelectSeatFilter(): Array<{value: string, description: string}> {
    return [
      {value: TypeFilterSeat.TOTAL_PAX, description: this.translateService.instant(`SEARCH_AIRCRAFT.${TypeFilterSeat.TOTAL_PAX}`)},
      {value: TypeFilterSeat.EXACT, description: this.translateService.instant(`SEARCH_AIRCRAFT.${TypeFilterSeat.EXACT}`)},
      {value: TypeFilterSeat.F_C, description: this.translateService.instant(`SEARCH_AIRCRAFT.${TypeFilterSeat.F_C}`)}
    ]
  }

  private loadSelectsData() {
    this.loadCountries();
    this.loadAirports();
    this.loadCategories();
    this.loadRegions();
    this.loadFleetTypes();
    this.loadOperators();
  }

  private obtainParams(): void {
    const { operationType } = this.route.snapshot.queryParams;
    this.route.params.subscribe((params: {fileId: string, routeId: string}) => {
      this.fileId = parseInt(params.fileId, 10);
      this.routeId = parseInt(params.routeId, 10);
      this.flightService.getFlights(this.fileId, this.routeId).subscribe((page: Page<Flight>) => {
        const flight: Flight =  page.content[0];
        this.searchForm.get('seatF').setValue(flight.seatsF);
        this.searchForm.get('seatC').setValue(flight.seatsC);
        this.searchForm.get('seatY').setValue(flight.seatsY);
        this.searchForm.get('beds').setValue(flight.beds);
        this.searchForm.get('stretchers').setValue(flight.stretchers);
        this.searchForm.get('airports').setValue([flight.origin]);
      });
    });
    this.operationType = operationType;
    if (this.operationType) {
      this.categoriesService.getFleetCategories(
        { 'filter_code': this.obtainCategoryCodFromOperationType(this.operationType) }
      ).subscribe((categories: Page<FleetCategory>) => {
        this.searchForm.get('category').setValue(categories.content[0]);
      });
    }
  }

  private initGeneralDataFormSubscriptions(): void {
    this.searchForm.get('category').valueChanges.pipe(takeUntil(this.unsubscriber$)).subscribe(
      (category: FleetCategory) => {
        if (category) {
          this.categoryIdSelected = category.id.toString();
          this.loadSubcategories(category);
        } else {
          this.searchForm.get('subcategory').reset();
        }
      }
    );
  }

  public filterAircraftTable(): void {
    this.searchForm.get('nearbyAirportFrom').updateValueAndValidity();
    this.searchForm.get('nearbyAirportTo').updateValueAndValidity();
    this.searchForm.get('airports').updateValueAndValidity();
    if (this.searchForm.valid) {
      this.filterExpanded = false;
      this.tableExpanded = true;
      this.setAircraftFilter();
      this.searchAircraftService.searchAircraft(this.aircraftSearch)
        .subscribe((aircrafts: Array<AircraftSearchResult>) => {
          this.selectedItems = [];
          this.aircrafts = aircrafts;
          this.dataSource = new MatTableDataSource(aircrafts);
          this.dataSource.paginator = this.paginator;
          this.resultsLength = aircrafts.length;
        });
    }
  }

  private setAircraftFilter(): void {
    this.aircraftSearch = new AircraftFilter();
    this.aircraftSearch.routeId = this.routeId;
    this.aircraftSearch.airports = this.searchForm.value.airports ? this.searchForm.value.airports : [];
    this.aircraftSearch.countries = this.searchForm.value.countries ? this.searchForm.value.countries : [];
    this.aircraftSearch.operators = this.searchForm.value.operators ? this.searchForm.value.operators : [];
    this.aircraftSearch.fleetTypes = this.searchForm.value.fleetTypes ? this.searchForm.value.fleetTypes : [];
    this.aircraftSearch.beds = this.searchForm.value.beds;
    this.aircraftSearch.category = this.searchForm.value.category;
    this.aircraftSearch.subcategory = this.searchForm.value.subcategory;
    this.aircraftSearch.minumunSubcategory = this.searchForm.value.minimunSubcategory;
    this.aircraftSearch.stretchers = this.searchForm.value.stretchers;
    this.aircraftSearch.nearbyAirport = this.searchForm.value.nearbyAirport;
    this.aircraftSearch.nearbyAirportFrom = this.searchForm.value.nearbyAirportFrom;
    this.aircraftSearch.nearbyAirportTo = this.searchForm.value.nearbyAirportTo;
    this.aircraftSearch.flightScales = this.searchForm.value.flightScales;
    this.aircraftSearch.flightScalesValue = this.searchForm.value.flightScalesValue;
    this.aircraftSearch.operationType = this.operationType;
    this.aircraftSearch.typeFilterSeat = this.searchForm.value.filterSeat;
    this.aircraftSearch.seatC = this.searchForm.value.seatC;
    this.aircraftSearch.seatF = this.searchForm.value.seatF;
    this.aircraftSearch.seatY = this.searchForm.value.seatY;
  }

  public quote(): void {
    if (this.selectedItems.length > 0) {
      const aircraftSelected: Array<AircraftSearchResult> = this.aircrafts
        .filter((aircraftSearch: AircraftSearchResult) => this.selectedItems.includes(aircraftSearch.aircraftId));
      const contributionsCalls: Array<Observable<void>> = [];
      aircraftSelected.forEach((aircraftSearch: AircraftSearchResult) => {
        const contribution: Contribution = {
          aircraftId: aircraftSearch.aircraftId,
          cargoAirborne: aircraftSearch.maxCargo,
          contributionState: ContributionStates.PENDING,
          fileId: this.fileId,
          routeId: this.routeId,
          operatorId: aircraftSearch.operatorId
        };
        contributionsCalls.push(this.contributionService.createContribution(
          this.fileId,
          this.routeId,
          contribution
        ));
      });
      forkJoin(contributionsCalls).subscribe(() => {
        this.goBack(true);
      }, (error) => console.log(error));
    }
  }

  public goBack(expandedQuote: boolean = false): void {
    this.router.navigate([`/files/${this.fileId}`], {queryParams: {expandedQuote}});
  }

  public isChecked(aircraftId: number): boolean {
    return this.selectedItems.includes(aircraftId);
  }

  public checkAircraft(checked: boolean, aircraftId: number): void {
    if (checked) {
      this.selectedItems.push(aircraftId);
    } else {
      const index: number = this.selectedItems.findIndex((item: number) => item === aircraftId);
      this.selectedItems.splice(index, 1);
    }
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.searchForm.get(controlName);
    return control && control.invalid;
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.searchForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public hasCategorySelected(): boolean {
    return this.searchForm.get('category')?.value !== '';
  }

  public hiddenNearbyAirport(): boolean {
    return !this.searchForm.get('nearbyAirport')?.value;
  }

  public hiddenFlightScalesValue(): boolean {
    return !this.searchForm.get('flightScales')?.value;
  }

  public disabledQuote(): boolean {
    return !this.selectedItems || this.selectedItems.length === 0;
  }

  public getSubcategoryPlaceholder(): string {
    return this.hasCategorySelected() ? 'SEARCH_AIRCRAFT.SELECT_SUBCATEGORY' : 'SEARCH_AIRCRAFT.SELECT_CATEGORY_FIRST';
  }

  public getQuantityQuote(): string {
    return !this.disabledQuote() ? `(${this.selectedItems.length})` : '';
  }

  public getSeatsFCY(aircraft: AircraftSearchResult): string {
    return `${aircraft.seatingF} / ${aircraft.seatingC} / ${aircraft.seatingY}`;
  }

  public getBedsAndStretchers(aircraft: AircraftSearchResult): string {
    return `${aircraft.nighttimeConfiguration} / ${aircraft.stretchers | 0}`;
  }

  public getTimeOfFlight(aircraft: AircraftSearchResult): string {
    const hour: number = Math.floor(aircraft.timeInHours);
    const minutes: number = Math.floor((aircraft.timeInHours - hour) * 60);
    const minutesStr: string = minutes < 10 ? `0${minutes}` : minutes.toString();
    return `${hour}:${minutesStr}h`;
  }

  private loadCountries(): void {
    this.countries$ = concat(
      of([]), // default items
      this.countriesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.countriesLoading = true)),
        switchMap((term: string) =>
          this.countriesService.getCountries({ filter_name: term }).pipe(
            map((page: Page<Country>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.countriesLoading = false))
          )
        )
      )
    );
  }

  private loadAirports(): void {
    this.airports$ = concat(
      of([]), // default items
      this.airportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.airportsLoading = true)),
        switchMap((term: string): Observable<Airport[]> =>
          this.airportsService.searchAirports(term).pipe(
            map((page: Page<Airport>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.airportsLoading = false)))
        )
      )
    );
  }

  private loadCategories(): void {
    this.categoriesService.getFleetCategories().subscribe(
      (categories: Page<FleetCategory>) => this.categories = categories.content
    );
  }

  private loadRegions(): void {
    this.regionsService.getRegions().subscribe(
      (regions: Page<Region>) => this.regions = regions.content
    );
  }

  private loadSubcategories(category: FleetCategory): void {
    this.subcategoriesService.getFleetSubcategoriesFromCategory(category, {sort: 'order'}).subscribe(
      (subcategories: Page<FleetSubcategory>) => this.subcategories = subcategories.content
    );
  }

  private loadFleetTypes(): void {
    this.fleetTypes$ = concat(
      of([]), // default items
      this.fleetTypesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.fleetTypesLoading = true)),
        switchMap((term: string) =>
          this.fleetTypeService.searchAirports(term).pipe(
            map((page: Page<FleetType>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.fleetTypesLoading = false))
          )
        )
      )
    );
  }

  private loadOperators(): void {
    this.operators$ = concat(
      of([]), // default items
      this.operatorsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.operatorsLoading = true)),
        switchMap((term: string) =>
          this.operatorsService.searchAirports(term).pipe(
            map((page: Page<Operator>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.operatorsLoading = false))
          )
        )
      )
    );
  }

  private validatorRequiredNearbyAirport(formControl: FormControl): ValidationErrors {
    let validator: ValidationErrors = null;
    if (this.searchForm && this.searchForm.get('nearbyAirport').value
      && (formControl.value === '' || formControl.value?.length === 0)) {
      validator = {
        required: true
      };
    }
    return validator;
  }

  private validatorMaxValueNearbyAirportFrom(formControl: FormControl): ValidationErrors {
    let validator: ValidationErrors = null;
    if (this.searchForm && this.searchForm.get('nearbyAirport').value
      && formControl.value !== ''
      && this.searchForm.get('nearbyAirportTo').value !== '') {
      const from: number = parseInt(formControl.value, 10);
      const to: number = parseInt(this.searchForm.get('nearbyAirportTo').value, 10);
      if (from > to) {
        validator = {
          maxValue: true
        };
      }
    }
    return validator;
  }
  private obtainCategoryCodFromOperationType(operationType: OperationType): string {
    let categoryCod: string;
    switch (operationType) {
      case OperationType.ACMI:
      case OperationType.COMMERCIAL:
      case OperationType.GROUP:
        categoryCod = 'COMMERCIAL';
        break;
      case OperationType.EXECUTIVE:
        categoryCod = 'EXECUTIVE';
        break;
      case OperationType.FREIGHT:
        categoryCod = 'FREIGHT';
        break;
    }
    return categoryCod;
  }
}

