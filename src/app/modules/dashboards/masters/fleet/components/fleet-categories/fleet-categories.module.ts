import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetCategoriesRoutingModule } from './fleet-categories-routing.module';
import { FleetCategoriesComponent } from './fleet-categories.component';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FleetCategoryDetailComponent } from './components/fleet-category-detail/fleet-category-detail.component';
import { FleetSubcategoryDetailComponent } from './components/fleet-subcategory-detail/fleet-subcategory-detail.component';


@NgModule({
  declarations: [FleetCategoriesComponent, FleetCategoryDetailComponent, FleetSubcategoryDetailComponent],
  imports: [CommonModule, FleetCategoriesRoutingModule, CoreModule, ReactiveFormsModule]
})
export class FleetCategoriesModule { }
