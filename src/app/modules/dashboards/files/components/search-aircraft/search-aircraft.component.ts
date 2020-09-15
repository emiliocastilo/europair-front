import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, FormControl } from '@angular/forms';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { Country } from '../../../masters/countries/models/country';
import { CountriesService } from '../../../masters/countries/services/countries.service';
import { Aircraft } from '../../../masters/fleet/components/aircraft/models/Aircraft.model';
import { AircraftService } from '../../../masters/fleet/components/aircraft/services/aircraft.service';
import { FleetCategoriesService } from '../../../masters/fleet/components/fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../masters/fleet/components/fleet-categories/services/fleet-subcategories.service';
import { FleetTypesService } from '../../../masters/fleet/components/fleet-types/services/fleet-types.service';
import { FleetCategory, FleetType } from '../../../masters/fleet/models/fleet';
import { Operator } from '../../../masters/operators/models/Operator.model';
import { OperatorsService } from '../../../masters/operators/services/operators.service';
import { AircraftSearch } from './models/aircraft-search.model';
import { AircraftSearchTableAdapterService } from './services/aircraft-search-table-adapter.service';

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
  public airportIdSelected: string;

  public categories$: Observable<Airport[]>;
  public categoriesInput$ = new Subject<string>();
  public categoriesLoading = false;
  public categoryIdSelected: string;

  public subcategories$: Observable<Airport[]>;
  public subcategoriesInput$ = new Subject<string>();
  public subcategoriesLoading = false;
  public subcategoryIdSelected: string;

  public fleetTypes$: Observable<FleetType[]>;
  public fleetTypesInput$ = new Subject<string>();
  public fleetTypesLoading = false;

  public operators$: Observable<Operator[]>;
  public operatorsInput$ = new Subject<string>();
  public operatorsLoading = false;

  public searchForm: FormGroup = this.fb.group({
    country: [''],
    airport: [''],
    nearbyAirport: [false],
    nearbyAirportFrom: ['', [this.validatorRequiredNearbyAirport.bind(this), this.validatorMaxValueNearbyAirportFrom.bind(this)]],
    nearbyAirportTo: ['', this.validatorRequiredNearbyAirport.bind(this)],
    category: [''],
    subcategory: [''],
    fleetType: [[]],
    operator: [''],
    passenger: ['']
  });

  private unsubscriber$: Subject<void> = new Subject();

  public aircrafts: Array<Aircraft>;
  public aircraftsColumnsHeader: Array<ColumnHeaderModel>;
  public aircraftsColumnsData: Array<RowDataModel>;
  public aircraftsPagination: PaginationModel;

  private aircraftTableFilter: any = {};
  private aircraftSortForm = this.fb.group({ sort: [''] });

  public filterExpanded: boolean;
  public tableExpanded: boolean;
  private selectedItems: Array<number>;
  private aircraftSearch: AircraftSearch;

  constructor(
    private readonly fb: FormBuilder,
    private readonly aircraftTableAdapter: AircraftSearchTableAdapterService,
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService,
    private readonly aircraftsService: AircraftService,
    private readonly categoriesService: FleetCategoriesService,
    private readonly subcategoriesService: FleetSubcategoriesService,
    private readonly fleetTypeService: FleetTypesService,
    private readonly operatorsService: OperatorsService
  ) { }

  ngOnInit(): void {
    this.aircrafts = [];
    this.filterExpanded = true;
    this.tableExpanded = false;
    this.loadCountries();
    this.loadAirports();
    this.loadCategories();
    this.loadSubcategories();
    this.loadFleetTypes();
    this.loadOperators();
    this.initTable();
    this.initGeneralDataFormSubscriptions();
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
        switchMap((term: string): Observable<Airport[]> => {
          const filter = { filter_name: term };
          filter['filter_country.id'] = this.countryIdSelected ?? '';
          return this.airportsService.getAirports(filter).pipe(
            map((page: Page<Airport>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.airportsLoading = false)));
        })
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
          return this.subcategoriesService.getFleetSubcategoriesFromCategory(category, { filter_name: term }).pipe(
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
          this.fleetTypeService.getFleetTypes({ filter_name: term }).pipe(
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

  private initGeneralDataFormSubscriptions(): void {
    this.searchForm.get('country').valueChanges.pipe(takeUntil(this.unsubscriber$)).subscribe(
      (country: Country) => (this.countryIdSelected = country && country.id.toString())
    );
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

  private initTable(): void {
    this.aircraftsColumnsHeader = this.aircraftTableAdapter.getAircraftColumnsHeader();
  }

  public filterAircraftTable(): void {
    this.searchForm.get('nearbyAirportFrom').updateValueAndValidity();
    this.searchForm.get('nearbyAirportTo').updateValueAndValidity();
    if (this.searchForm.valid) {
      this.filterExpanded = false;
      this.tableExpanded = true;
      this.setAircraftFilter();
      const filter = {
        ...this.aircraftSortForm.value,
        ...this.aircraftTableFilter.value
      };
      this.aircraftsService.getAircraft(filter).subscribe((aircrafts: Page<Aircraft>) => {
        this.aircrafts = aircrafts.content;
        this.aircraftsColumnsData = this.aircraftTableAdapter.getAircraftTableDataFromAircraft(this.aircrafts);
        this.aircraftsPagination = this.aircraftTableAdapter.getPagination();
      });
    }
  }

  private setAircraftFilter(): void {
    this.aircraftSearch = new AircraftSearch();
    this.aircraftSearch.airport = this.searchForm.value.airport;
    this.aircraftSearch.country = this.searchForm.value.country;
    this.aircraftSearch.category = this.searchForm.value.category;
    this.aircraftSearch.subcategory = this.searchForm.value.subcategory;
    this.aircraftSearch.operator = this.searchForm.value.operator;
    this.aircraftSearch.passengers = this.searchForm.value.passenger;
    this.aircraftSearch.nearbyAirportFrom = this.searchForm.value.nearbyAirportFrom;
    this.aircraftSearch.nearbyAirportTo = this.searchForm.value.nearbyAirportTo;
  }

  public onAircraftSelected(selectedItems: number[]) {
    this.selectedItems = selectedItems;
  }

  public onFilterAircrafts(airportFilter: ColumnFilter) {
    this.aircraftTableFilter[airportFilter.identifier] = airportFilter.searchTerm;
    this.filterAircraftTable();
  }

  public onSortAircrafts(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.aircraftSortForm.patchValue({ sort: sort });
    this.filterAircraftTable();
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

  public getSubcategoryPlaceholder(): string {
    return this.hasCategorySelected() ? 'SEARCH_AIRCRAFT.SELECT_SUBCATEGORY' : 'SEARCH_AIRCRAFT.SELECT_CATEGORY_FIRST';
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
}
