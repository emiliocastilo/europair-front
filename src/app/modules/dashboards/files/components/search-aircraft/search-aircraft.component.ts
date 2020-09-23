import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { concat, forkJoin, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { Country } from '../../../masters/countries/models/country';
import { CountriesService } from '../../../masters/countries/services/countries.service';
import { AircraftBase } from '../../../masters/fleet/components/aircraft/models/Aircraft.model';
import { FleetCategoriesService } from '../../../masters/fleet/components/fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../masters/fleet/components/fleet-categories/services/fleet-subcategories.service';
import { FleetTypesService } from '../../../masters/fleet/components/fleet-types/services/fleet-types.service';
import { FleetCategory, FleetType } from '../../../masters/fleet/models/fleet';
import { Operator } from '../../../masters/operators/models/Operator.model';
import { OperatorsService } from '../../../masters/operators/services/operators.service';
import { AircraftFilter } from './models/aircraft-filter.model';
import { AircraftSearchResult } from './models/aircraft-search.model';
import { AircraftSearchService } from './services/aircraft-search.service';
import { ContributionService } from '../../services/contribution.service';
import { Contribution, ContributionStates } from './models/contribution.model';


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

  public countries$: Observable<Country[]>;
  public countriesInput$ = new Subject<string>();
  public countriesLoading = false;
  public countryIdSelected: string;

  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;

  public categories$: Observable<Airport[]>;
  public categoriesInput$ = new Subject<string>();
  public categoriesLoading = false;
  public categoryIdSelected: string;

  public subcategories$: Observable<Airport[]>;
  public subcategoriesInput$ = new Subject<string>();
  public subcategoriesLoading = false;

  public fleetTypes$: Observable<FleetType[]>;
  public fleetTypesInput$ = new Subject<string>();
  public fleetTypesLoading = false;

  public operators$: Observable<Operator[]>;
  public operatorsInput$ = new Subject<string>();
  public operatorsLoading = false;

  public searchForm: FormGroup = this.fb.group({
    countries: [[]],
    airports: [[]],
    nearbyAirport: [false],
    nearbyAirportFrom: ['', [this.validatorRequiredNearbyAirport.bind(this), this.validatorMaxValueNearbyAirportFrom.bind(this), Validators.min(0)]],
    nearbyAirportTo: ['', [this.validatorRequiredNearbyAirport.bind(this), Validators.min(0)]],
    category: [''],
    subcategory: [''],
    fleetTypes: [[]],
    operators: [[]],
    seatF: ['', Validators.min(0)],
    seatC: ['', Validators.min(0)],
    seatY: ['', Validators.min(0)],
    beds: ['', Validators.min(0)],
    stretchers: ['', Validators.min(0)],
  });

  private unsubscriber$: Subject<void> = new Subject();

  public aircrafts: Array<AircraftSearchResult>;
  public dataSource: MatTableDataSource<AircraftSearchResult>;
  public resultsLength: number;
  public pageSize: number;
  public columnsToDisplay: Array<string>;

  public filterExpanded: boolean;
  public tableExpanded: boolean;

  private selectedItems: Array<number>;
  private aircraftSearch: AircraftFilter;

  private fileId: number = 0;
  private routeId: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly _location: Location,
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService,
    private readonly categoriesService: FleetCategoriesService,
    private readonly subcategoriesService: FleetSubcategoriesService,
    private readonly fleetTypeService: FleetTypesService,
    private readonly operatorsService: OperatorsService,
    private readonly searchAircraftService: AircraftSearchService,
    private readonly contributionService: ContributionService
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
    this.columnsToDisplay = ['selection', 'operator', 'dateAOC', 'insuranceDate', 'airport', 'category', 'subcategory', 'fleetType', 'quantity', 'seats', 'bedsAndStretchers', 'maximumLoad', 'observations', 'flightTime'];
  }

  private loadSelectsData() {
    this.loadCountries();
    this.loadAirports();
    this.loadCategories();
    this.loadSubcategories();
    this.loadFleetTypes();
    this.loadOperators();
  }

  private obtainParams(): void {
    const { seatsC, seatsY, seatsF, beds, stretchers, operationType, fileId, routeId } = this.route.snapshot.queryParams;
    this.fileId = fileId;
    this.routeId = routeId;
    this.searchForm.get('seatF').setValue(seatsF);
    this.searchForm.get('seatC').setValue(seatsC);
    this.searchForm.get('seatY').setValue(seatsY);
    this.searchForm.get('beds').setValue(beds);
    this.searchForm.get('stretchers').setValue(stretchers);
    if (operationType) {
      this.categoriesService.getFleetCategories(
        { 'filter_code': this.obtainCategoryCodFromOperationType(operationType) }
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
        } else {
          this.searchForm.get('subcategory').reset();
        }
      }
    );
  }

  public filterAircraftTable(): void {
    this.searchForm.get('nearbyAirportFrom').updateValueAndValidity();
    this.searchForm.get('nearbyAirportTo').updateValueAndValidity();
    if (this.searchForm.valid) {
      this.filterExpanded = false;
      this.tableExpanded = true;
      this.setAircraftFilter();
      this.searchAircraftService.searchAircraft(this.aircraftSearch)
        .subscribe((aircrafts: Array<AircraftSearchResult>) => {
          this.selectedItems = [];
          this.aircrafts = aircrafts;
          this.dataSource = new MatTableDataSource(aircrafts);
          this.resultsLength = aircrafts.length;
          this.pageSize = aircrafts.length;
        });
    }
  }

  private setAircraftFilter(): void {
    this.aircraftSearch = new AircraftFilter();
    this.aircraftSearch.airports = this.searchForm.value.airports ? this.searchForm.value.airports : [];
    this.aircraftSearch.countries = this.searchForm.value.countries ? this.searchForm.value.countries : [];
    this.aircraftSearch.operators = this.searchForm.value.operators ? this.searchForm.value.operators : [];
    this.aircraftSearch.fleetTypes = this.searchForm.value.fleetTypes ? this.searchForm.value.fleetTypes : [];
    this.aircraftSearch.categories = this.searchForm.value.category ? this.searchForm.value.category : [];
    this.aircraftSearch.subcategories = this.searchForm.value.subcategory ? this.searchForm.value.subcategory : [];
    this.aircraftSearch.seatC = this.searchForm.value.seatC;
    this.aircraftSearch.seatF = this.searchForm.value.seatF;
    this.aircraftSearch.seatY = this.searchForm.value.seatY;
    this.aircraftSearch.beds = this.searchForm.value.beds;
    this.aircraftSearch.stretchers = this.searchForm.value.stretchers;
    this.aircraftSearch.nearbyAirport = this.searchForm.value.nearbyAirport;
    this.aircraftSearch.nearbyAirportFrom = this.searchForm.value.nearbyAirportFrom;
    this.aircraftSearch.nearbyAirportTo = this.searchForm.value.nearbyAirportTo;
  }

  public quote(): void {
    if (this.selectedItems.length > 0) {
      const aircraftSelected: Array<AircraftSearchResult> = this.aircrafts
        .filter((aircraftSearch: AircraftSearchResult) => this.selectedItems.includes(aircraftSearch.id));
      const contributionsCalls: Array<Observable<void>> = [];
      aircraftSelected.forEach((aircraftSearch: AircraftSearchResult) => {
        const contribution: Contribution = {
          aircraftId: aircraftSearch.id,
          cargoAirborne: aircraftSearch.load?.maximumLoad,
          contributionState: ContributionStates.QUOTED,
          fileId: this.fileId,
          routeId: this.routeId,
          operatorId: aircraftSearch.operator?.id,
          quotedTime: ''
        };
        contributionsCalls.push(this.contributionService.createContribution(
          this.fileId,
          this.routeId,
          contribution
        ));
      });
      forkJoin(contributionsCalls).subscribe(() => {
        this._location.back();
      }, (error) => {
        console.log(error);
      });
    }
  }

  public cancel(): void {
    this._location.back();
  }

  public checkAircraft(checked: boolean, id: number): void {
    if (checked) {
      this.selectedItems.push(id);
    } else {
      const index: number = this.selectedItems.findIndex((item: number) => item === id);
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

  public disabledQuote(): boolean {
    return !this.selectedItems || this.selectedItems.length === 0;
  }

  public getSubcategoryPlaceholder(): string {
    return this.hasCategorySelected() ? 'SEARCH_AIRCRAFT.SELECT_SUBCATEGORY' : 'SEARCH_AIRCRAFT.SELECT_CATEGORY_FIRST';
  }

  public getQuantityQuote(): string {
    return !this.disabledQuote() ? `(${this.selectedItems.length})` : '';
  }

  public getAirportBaseLabel(aircraft: AircraftSearchResult): string {
    let airports: string = '';
    if (aircraft.bases) {
      const base: AircraftBase = aircraft.bases.find((aircraftBase: AircraftBase) => aircraftBase.mainBase);
      airports = base?.airport.name || '';
    }
    return airports;
  }

  public getSeatsFCY(aircraft: AircraftSearchResult): string {
    return `${aircraft.seatingF} / ${aircraft.seatingC} / ${aircraft.seatingY}`;
  }

  public getBedsAndStretchers(aircraft: AircraftSearchResult): string {
    return `${aircraft.beds} / ${aircraft.stretchers}`;
  }

  public getTimeOfFlight(aircraft: AircraftSearchResult): string {
    const hour: number = Math.floor(aircraft.timeInHours);
    const minutes: number = (aircraft.timeInHours - hour) * 60;
    return `${hour}:${minutes}h`;
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
          this.airportsService.getAirports({ filter_name: term }).pipe(
            map((page: Page<Airport>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.airportsLoading = false)))
        )
      )
    );
  }

  private loadCategories(): void {
    this.categories$ = concat(
      of([]), // default items
      this.categoriesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.categoriesLoading = true)),
        switchMap((term: string): Observable<FleetCategory[]> =>
          this.categoriesService.getFleetCategories({ filter_name: term }).pipe(
            map((page: Page<FleetCategory>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.categoriesLoading = false)))
        )
      )
    );
  }

  private loadSubcategories(): void {
    this.subcategories$ = concat(
      of([]), // default items
      this.subcategoriesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.subcategoriesLoading = true)),
        switchMap((term: string): Observable<FleetCategory[]> => {
          const filter = { filter_name: term };
          const category: FleetCategory = { id: +this.categoryIdSelected };
          return this.subcategoriesService.getFleetSubcategoriesFromCategory(category, filter).pipe(
            map((page: Page<FleetCategory>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.subcategoriesLoading = false)));
        })
      )
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
          this.fleetTypeService.getFleetTypes({ filter_description: term }).pipe(
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
          this.operatorsService.getOperators({ filter_name: term }).pipe(
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
      && formControl.value === '') {
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
  private obtainCategoryCodFromOperationType(operationType: string): string {
    let categoryCod: string;
    switch (operationType) {
      case 'ACMI':
      case 'COMMERCIAL':
      case 'GROUP':
        categoryCod = 'COMMERCIAL';
        break;
      case 'EXECUTIVE':
        categoryCod = 'EXECUTIVE';
        break;
      case 'CHARGE':
        categoryCod = 'CHARGE';
        break;
    }
    return categoryCod;
  }
}

