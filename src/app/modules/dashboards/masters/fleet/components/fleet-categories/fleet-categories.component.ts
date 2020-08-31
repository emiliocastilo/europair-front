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
  @ViewChild('deleteSubcategoryModal', { static: true, read: ElementRef })
  private readonly confirmDeleteSubcategoryModal: ElementRef;

  public categoriesBarButtons: BarButton[];
  public subcategoriesBarButtons: BarButton[];

  public userData = { userName: 'Usuario', userRole: 'Administrador' };
  public categoriesColumnsHeader: Array<ColumnHeaderModel>;
  public categoriesColumnsData: Array<RowDataModel>;
  public subcategoriesColumnsHeader: Array<ColumnHeaderModel>;
  public subcategoriesColumnsData: Array<RowDataModel>;
  public categoriesSelectedCount = 0;
  public subcategoriesSelectedCount = 0;
  public categoryDetailColumnsData: Array<RowDataModel>;
  public categoryPagination: PaginationModel;
  public subcategoryDetailColumnsData: Array<RowDataModel>;
  public subcategoryPagination: PaginationModel;
  public categoryDetailTitle: string;
  public categorySelected: FleetCategory = EMPTY_FLEET_CATEGORY;
  public subcategoryDetailTitle: string;
  public subcategorySelected: FleetSubcategory = EMPTY_FLEET_SUBCATEGORY;

  private selectedCategory: number;
  private selectedSubcategory: number;
  private categories: Array<FleetCategory>;
  private subcategories: Array<FleetSubcategory>;
  private readonly barButtonCategoryActions = { new: this.newCategory.bind(this) };
  private readonly barButtonSubcategoryActions = { new: this.newSubcategory.bind(this) };
  private readonly categoryTableActions = {
    edit: this.editCategory.bind(this),
    delete: this.deleteCategory.bind(this)
  };
  private readonly subcategoryTableActions = {
    edit: this.editSubcategory.bind(this),
    delete: this.deleteSubcategory.bind(this)
  };

  constructor(
    private readonly modalService: ModalService,
    private readonly categoryService: FleetCategoriesService,
    private readonly subcategoryService: FleetSubcategoriesService,
    private readonly fleetCategoriesTableAdapterService: FleetCategoriesTableAdapterService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeCategoryTable();
    this.initializeSubcategoryTable();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newCategory: this.translateService.get('FLEET.CATEGORIES.NEW_CATEGORY'),
      deleteCategory: this.translateService.get('FLEET.CATEGORIES.DELETE_CATEGORY'),
      newSubcategory: this.translateService.get('FLEET.CATEGORIES.NEW_SUBCATEGORY'),
      deleteSubcategory: this.translateService.get('FLEET.CATEGORIES.DELETE_SUBCATEGORY')
    }).subscribe((data: { newCategory: string, deleteCategory: string, newSubcategory: string, deleteSubcategory: string }) => {
      this.categoriesBarButtons = [
        { type: BarButtonType.NEW, text: data.newCategory },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteCategory },
      ];
      this.subcategoriesBarButtons = [
        { type: BarButtonType.NEW, text: data.newSubcategory },
        { type: BarButtonType.DELETE_SELECTED, text: data.newSubcategory },
      ];
    });
  }

  private initializeCategoryTable(): void {
    this.categoriesColumnsHeader = this.fleetCategoriesTableAdapterService.getFleetCategoryColumnsHeader();
    this.obtainCategories();
  }

  private obtainCategories() {
    this.categoryService.getFleetCategories().subscribe((data: Page<FleetCategory>) => {
      this.categories = data.content;
      this.categoriesColumnsData = this.fleetCategoriesTableAdapterService.getFleetCategories(this.categories);
      this.categoryPagination = this.fleetCategoriesTableAdapterService.getPagination();
      this.categoryPagination.lastPage = Math.floor(this.categories.length / this.categoryPagination.elementsPerPage);
    });
  }

  private initializeSubcategoryTable(): void {
    this.subcategoriesColumnsHeader = this.fleetCategoriesTableAdapterService.getFleetSubcategoryColumnsHeader();
  }

  private obtainSubcategories() {
    this.subcategoryService.getFleetSubcategoriesFromCategory(this.categories[this.selectedCategory]).subscribe((data: Page<FleetSubcategory>) => {
      this.subcategories = data.content;
      this.subcategoriesColumnsData = this.fleetCategoriesTableAdapterService.getFleetSubcategories(this.subcategories);
      this.subcategoryPagination = this.fleetCategoriesTableAdapterService.getPagination();
      this.subcategoryPagination.lastPage = Math.floor(this.subcategories.length / this.subcategoryPagination.elementsPerPage);
    });
  }

  public showSubcategoriesTable(): boolean {
    return this.selectedCategory !== undefined;
  }


  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onCategorySelected(selectedIndex: number): void {
    this.selectedCategory = selectedIndex;
    this.obtainSubcategories();
  }

  public onCategoryAction(action: { actionId: string; selectedItem: number }): void {
    this.categoryTableActions[action.actionId](action.selectedItem);
  }

  public onSubcategorySelected(selectedIndex: number): void {
    this.selectedSubcategory = selectedIndex;
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

  private editCategory(selectedItem: number): void {
    this.initializeCategoryDetailModal(this.translateService.instant('FLEET.CATEGORIES.EDIT_CATEGORY'), {
      ...this.categories[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteCategory(selectedItem: number): void {
    this.selectedCategory = selectedItem;
    this.initializeModal(this.confirmDeleteCategoryModal);
    this.modalService.openModal();
  }

  private newSubcategory(): void {
    this.subcategoryDetailTitle = this.translateService.instant('FLEET.CATEGORIES.CREATE_SUBCATEGORY');
    this.initializeSubcategoryDetailModal(this.subcategoryDetailTitle, { ...EMPTY_FLEET_SUBCATEGORY });
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
    saveCategory.subscribe(() => this.obtainCategories());
  }

  public onSaveSubcategory(subcategory: FleetSubcategory): void {
    const saveSubcategory: Observable<FleetSubcategory> = subcategory.id === null ?
      this.subcategoryService.addFleetSubcategory(this.categories[this.selectedCategory], { ...subcategory, category: this.categories[this.selectedCategory] }) :
      this.subcategoryService.editFleetSubcategory(this.categories[this.selectedCategory], subcategory);
    saveSubcategory.subscribe(() => this.obtainSubcategories());
  }

  public onConfirmDeleteCategory(): void {
    this.categoryService.deleteFleetCategory(this.categories[this.selectedCategory]).subscribe(() => {
      this.obtainCategories();
    });
  }

  public onConfirmDeleteSubcategory(): void {
    this.subcategoryService.deleteFleetSubcategory(this.categories[this.selectedCategory], this.subcategories[this.selectedSubcategory]).subscribe(() => {
      this.obtainSubcategories();
    });
  }
}
