import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FleetCategoriesService } from './services/fleet-categories.service';
import { FleetSubcategoriesService } from './services/fleet-subcategories.service';
import { FleetCategory, EMPTY_FLEET_CATEGORY, FleetSubcategory, EMPTY_FLEET_SUBCATEGORY } from '../../models/fleet';
import { FleetCategoriesTableAdapterService } from './services/fleet-categories-table-adapter.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Observable, forkJoin } from 'rxjs';
import { FleetCategoryDetailComponent } from './components/fleet-category-detail/fleet-category-detail.component';
import { FleetSubcategoryDetailComponent } from './components/fleet-subcategory-detail/fleet-subcategory-detail.component';
import { TranslateService } from '@ngx-translate/core';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { FormBuilder } from '@angular/forms';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';

@Component({
  selector: 'app-fleet-categories',
  templateUrl: './fleet-categories.component.html',
  styleUrls: ['./fleet-categories.component.scss']
})
export class FleetCategoriesComponent implements OnInit {

  @ViewChild(FleetCategoryDetailComponent, { static: true, read: ElementRef })
  private readonly categoryDetailModal: ElementRef;
  @ViewChild(FleetSubcategoryDetailComponent, { static: true, read: ElementRef })
  private readonly subcategoryDetailModal: ElementRef;
  @ViewChild('deleteCategoryModal', { static: true, read: ElementRef })
  private readonly confirmDeleteCategoryModal: ElementRef;
  @ViewChild('deleteMultipleCategoriesModal', { static: true, read: ElementRef })
  private readonly confirmDeleteMultipleCategoriesModal: ElementRef;
  @ViewChild('deleteSubcategoryModal', { static: true, read: ElementRef })
  private readonly confirmDeleteSubcategoryModal: ElementRef;
  @ViewChild('deleteMultipleSubcategoriesModal', { static: true, read: ElementRef })
  private readonly confirmDeleteMultipleSubcategoriesModal: ElementRef;

  public categoriesBarButtons: BarButton[];
  public subcategoriesBarButtons: BarButton[];

  public userData = { userName: 'Usuario', userRole: 'Administrador' };
  public categoriesColumnsHeader: Array<ColumnHeaderModel>;
  public categoriesColumnsData: Array<RowDataModel>;
  public subcategoriesColumnsHeader: Array<ColumnHeaderModel>;
  public subcategoriesColumnsData: Array<RowDataModel>;
  public categoryDetailColumnsData: Array<RowDataModel>;
  public categoryPagination: PaginationModel;
  public subcategoryDetailColumnsData: Array<RowDataModel>;
  public subcategoryPagination: PaginationModel;
  public categoryDetailTitle: string;
  public categorySelected: FleetCategory = EMPTY_FLEET_CATEGORY;
  public subcategoryDetailTitle: string;
  public subcategorySelected: FleetSubcategory = EMPTY_FLEET_SUBCATEGORY;
  private categoryFilter = {};
  private subcategoryFilter = {};
  public translationParams = {};

  private selectedCategory: number;
  public selectedCategories: number[] = [];
  private selectedSubcategory: number;
  public selectedSubcategories: number[] = [];
  public categories: Array<FleetCategory>;
  public subcategories: Array<FleetSubcategory>;
  private readonly barButtonCategoryActions = { 
    new: this.newCategory.bind(this),
    delete_selected: this.deleteSelectedCategories.bind(this),
  };
  private readonly barButtonSubcategoryActions = { 
    new: this.newSubcategory.bind(this),
    delete_selected: this.deleteSelectedSubcategories.bind(this),
  };
  private readonly categoryTableActions = {
    edit: this.editCategory.bind(this),
    delete: this.deleteCategory.bind(this)
  };
  private readonly subcategoryTableActions = {
    edit: this.editSubcategory.bind(this),
    delete: this.deleteSubcategory.bind(this)
  };

  public categoryAdvancedSearchForm = this.fb.group({
    filter_code: [''],
    filter_name: [''],
  });
  public categorySortForm = this.fb.group({
    sort: [''],
  });

  public subcategoryAdvancedSearchForm = this.fb.group({
    filter_order: [''],
    filter_code: [''],
    filter_name: [''],
  });
  public subcategorySortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private readonly modalService: ModalService,
    private readonly categoryService: FleetCategoriesService,
    private readonly subcategoryService: FleetSubcategoriesService,
    private readonly fleetCategoriesTableAdapterService: FleetCategoriesTableAdapterService,
    private readonly translateService: TranslateService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeCategoryTable();
    this.initializeSubcategoryTable();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newCategory: this.translateService.get('FLEET.CATEGORIES.NEW_CATEGORY'),
      deleteCategory: this.translateService.get('FLEET.CATEGORIES.DELETE'),
      newSubcategory: this.translateService.get('FLEET.CATEGORIES.NEW_SUBCATEGORY'),
      deleteSubcategory: this.translateService.get('FLEET.CATEGORIES.DELETE')
    }).subscribe((data: { newCategory: string, deleteCategory: string, newSubcategory: string, deleteSubcategory: string }) => {
      this.categoriesBarButtons = [
        { type: BarButtonType.NEW, text: data.newCategory },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteCategory },
      ];
      this.subcategoriesBarButtons = [
        { type: BarButtonType.NEW, text: data.newSubcategory },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteSubcategory },
      ];
    });
  }

  private initializeCategoryTable(): void {
    this.categoriesColumnsHeader = this.fleetCategoriesTableAdapterService.getFleetCategoryColumnsHeader();
    this.filterCategoryTable();
  }

  private obtainCategories(searchFilter?: SearchFilter) {
    this.categoryService.getFleetCategories(searchFilter).subscribe((data: Page<FleetCategory>) => {
      this.categories = data.content;
      this.categoriesColumnsData = this.fleetCategoriesTableAdapterService.getFleetCategories(this.categories);
      this.categoryPagination = this.fleetCategoriesTableAdapterService.getPagination();
      this.categoryPagination.lastPage = this.categories.length / this.categoryPagination.elementsPerPage;
    });
  }

  private initializeSubcategoryTable(): void {
    this.subcategoriesColumnsHeader = this.fleetCategoriesTableAdapterService.getFleetSubcategoryColumnsHeader();
  }

  private obtainSubcategories(searchFilter?: SearchFilter) {
    this.subcategoryService.getFleetSubcategoriesFromCategory(this.categories[this.selectedCategory], searchFilter).subscribe((data: Page<FleetSubcategory>) => {
      this.subcategories = data.content;
      this.subcategoriesColumnsData = this.fleetCategoriesTableAdapterService.getFleetSubcategories(this.subcategories);
      this.subcategoryPagination = this.fleetCategoriesTableAdapterService.getPagination();
      this.subcategoryPagination.lastPage = this.subcategories.length / this.subcategoryPagination.elementsPerPage;
    });
  }

  public hasOneCategorySelected(): boolean {
    return this.selectedCategories.length === 1;
  }


  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onFilterCategories(categoryFilter: ColumnFilter): void {
    this.categoryFilter[categoryFilter.identifier] = categoryFilter.searchTerm;
    this.filterCategoryTable();
  }

  public onSortCategories(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.categorySortForm.patchValue({ sort: sort });
    this.filterCategoryTable();
  } 

  public onCategoriesSelected(selectedCategories: number[]): void {
    this.selectedCategories = selectedCategories;
    if(this.hasOneCategorySelected()) {
      this.selectedCategory = this.selectedCategories[0];
      this.filterSubcategoryTable();
    }
  }

  public onCategoryAction(action: { actionId: string; selectedItem: number }): void {
    this.categoryTableActions[action.actionId](action.selectedItem);
  }

  public onFilterSubcategories(subcategoryFilter: ColumnFilter): void {
    this.subcategoryFilter[subcategoryFilter.identifier] = subcategoryFilter.searchTerm;
    this.filterSubcategoryTable();
  }

  public onSortSubcategories(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.subcategorySortForm.patchValue({ sort: sort });
    this.filterSubcategoryTable();
  }

  public onSubcategoriesSelected(selectedSubcategories: number[]): void {
    this.selectedSubcategories = selectedSubcategories;
  }

  public onSubcategoryAction(action: { actionId: string; selectedItem: number }): void {
    this.subcategoryTableActions[action.actionId](action.selectedItem);
  }

  public onBarButtonCategoriesClicked(barButtonType: BarButtonType): void {
    this.barButtonCategoryActions[barButtonType]();
  }

  public onBarButtonSubcategoriesClicked(barButtonType: BarButtonType): void {
    this.barButtonSubcategoryActions[barButtonType]();
  }

  private newCategory(): void {
    this.categoryDetailTitle = this.translateService.instant('FLEET.CATEGORIES.CREATE_CATEGORY');
    this.initializeCategoryDetailModal(this.categoryDetailTitle, { ...EMPTY_FLEET_CATEGORY });
    this.modalService.openModal();
  }

  private deleteSelectedCategories(): void {
    this.initializeModal(this.confirmDeleteMultipleCategoriesModal);
    this.modalService.openModal();
  }

  private editCategory(selectedItem: number): void {
    this.initializeCategoryDetailModal(this.translateService.instant('FLEET.CATEGORIES.EDIT_CATEGORY'), {
      ...this.categories[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteCategory(selectedItem: number): void {
    this.selectedCategory = selectedItem;
    this.translationParams = {category: this.categories[selectedItem]?.code};
    this.initializeModal(this.confirmDeleteCategoryModal);
    this.modalService.openModal();
  }

  private newSubcategory(): void {
    this.subcategoryDetailTitle = this.translateService.instant('FLEET.CATEGORIES.CREATE_SUBCATEGORY');
    this.initializeSubcategoryDetailModal(this.subcategoryDetailTitle, { ...EMPTY_FLEET_SUBCATEGORY });
    this.modalService.openModal();
  }

  private deleteSelectedSubcategories(): void {
    this.initializeModal(this.confirmDeleteMultipleSubcategoriesModal);
    this.modalService.openModal();
  }

  private editSubcategory(selectedItem: number): void {
    this.initializeSubcategoryDetailModal(this.translateService.instant('FLEET.CATEGORIES.EDIT_SUBCATEGORY'), {
      ...this.subcategories[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteSubcategory(selectedItem: number): void {
    this.selectedSubcategory = selectedItem;
    this.translationParams = {subcategory: this.subcategories[selectedItem]?.code};
    this.initializeModal(this.confirmDeleteSubcategoryModal);
    this.modalService.openModal();
  }

  private initializeCategoryDetailModal(categoryDetailTitle: string, categorySelected: FleetCategory): void {
    this.categoryDetailTitle = categoryDetailTitle;
    this.categorySelected = categorySelected;
    this.initializeModal(this.categoryDetailModal);
  }

  private initializeSubcategoryDetailModal(subcategoryDetailTitle: string, subcategorySelected: FleetSubcategory): void {
    this.subcategoryDetailTitle = subcategoryDetailTitle;
    this.subcategorySelected = subcategorySelected;
    this.initializeModal(this.subcategoryDetailModal);
  }

  public onSaveCategory(category: FleetCategory): void {
    const saveCategory: Observable<FleetCategory> = category.id === null ? this.categoryService.addFleetCategory(category) : this.categoryService.editFleetCategory(category);
    saveCategory.subscribe(() => this.filterCategoryTable());
  }

  public onSaveSubcategory(subcategory: FleetSubcategory): void {
    const saveSubcategory: Observable<FleetSubcategory> = subcategory.id === null ?
      this.subcategoryService.addFleetSubcategory(this.categories[this.selectedCategory], { ...subcategory, category: this.categories[this.selectedCategory] }) :
      this.subcategoryService.editFleetSubcategory(this.categories[this.selectedCategory], subcategory);
    saveSubcategory.subscribe(() => this.filterSubcategoryTable());
  }

  public onConfirmDeleteCategory(): void {
    this.categoryService.deleteFleetCategory(this.categories[this.selectedCategory]).subscribe(() => {
      this.filterCategoryTable();
    });
  }

  public onConfirmDeleteMultipleCategory(): void {
    console.log('DELETING CATEGORIES ', this.selectedCategories.map(item => this.categories[item].id));
  }

  public onConfirmDeleteSubcategory(): void {
    this.subcategoryService.deleteFleetSubcategory(this.categories[this.selectedCategory], this.subcategories[this.selectedSubcategory]).subscribe(() => {
      this.filterSubcategoryTable();
    });
  }

  public onConfirmDeleteMultipleSubcategory(): void {
    console.log('DELETING SUBCATEGORIES ', this.selectedSubcategories.map(item => this.subcategories[item].id));
  }

  private filterCategoryTable(): void {
    this.categoryAdvancedSearchForm.patchValue(this.categoryFilter);
    const filter = {
      ...this.categoryAdvancedSearchForm.value,
      ...this.categorySortForm.value,
    };
    this.obtainCategories(filter);
  }

  private filterSubcategoryTable(): void {
    this.subcategoryAdvancedSearchForm.patchValue(this.subcategoryFilter);
    const filter = {
      ...this.subcategoryAdvancedSearchForm.value,
      ...this.subcategorySortForm.value,
    };
    this.obtainSubcategories(filter);
  }
}
