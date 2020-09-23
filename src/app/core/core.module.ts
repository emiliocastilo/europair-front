import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { RouterModule } from '@angular/router';
import { CheckboxComponent } from './components/basic/checkbox/checkbox.component';
import { InputTextComponent } from './components/basic/input-text/input-text.component';
import { LeftSidebarComponent } from './components/menus/left-sidebar/left-sidebar.component';
import { PageBarComponent } from './components/menus/page-bar/page-bar.component';
import { LetterTableComponent } from './components/table/components/letter-table/letter-table.component';
import { ColumnActionsComponent } from './components/table/components/column-actions/column-actions.component';
import { ColumnCheckboxComponent } from './components/table/components/column-checkbox/column-checkbox.component';
import { ModalComponent } from './components/modal/modal.component';
import { ButtonBarComponent } from './components/menus/button-bar/button-bar.component';
import { MobileBarComponent } from './components/menus/mobile-bar/mobile-bar.component';
import { PaginationComponent } from './components/table/components/pagination/pagination.component';
import { MatCollapsibleDirective } from './directives/mat-collapsible.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectComponent } from './components/basic/select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './components/menus/search-bar/search-bar.component';
import { AdvancedSearchComponent } from './components/menus/advanced-search/advanced-search.component';
import { SortMenuComponent } from './components/menus/sort-menu/sort-menu.component';
import { SortButtonComponent } from './components/table/components/sort-button/sort-button.component';

import { MatTooltipDirective } from './directives/mat-tooltip.directive';
import { TableAuditTooltipDirective } from './directives/table-audit-tooltip.directive';
import { TranslateModule } from '@ngx-translate/core';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { SwitchComponent } from './components/basic/switch/switch.component';
import { MatDropdownDirective } from './directives/mat-dropdown.directive';
import { TopBarComponent } from './components/menus/top-bar/top-bar.component';
import { InputComponent } from './components/basic/input/input.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    AdvancedSearchComponent,
    ButtonBarComponent,
    CheckboxComponent,
    CheckboxComponent,
    ColumnActionsComponent,
    ColumnCheckboxComponent,
    InputComponent,
    InputTextComponent,
    LeftSidebarComponent,
    LetterTableComponent,
    MatCollapsibleDirective,
    MatDropdownDirective,
    MatTooltipDirective,
    MobileBarComponent,
    ModalComponent,
    PageBarComponent,
    PaginationComponent,
    SearchBarComponent,
    SelectComponent,
    SentenceCasePipe,
    SortButtonComponent,
    SortMenuComponent,
    SwitchComponent,
    TableAuditTooltipDirective,
    TableComponent,
    TopBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [
    AdvancedSearchComponent,
    ButtonBarComponent,
    CheckboxComponent,
    InputComponent,
    InputTextComponent,
    LeftSidebarComponent,
    MatCollapsibleDirective,
    MatDropdownDirective,
    MatTooltipDirective,
    MobileBarComponent,
    ModalComponent,
    PageBarComponent,
    SearchBarComponent,
    SelectComponent,
    SentenceCasePipe,
    SortMenuComponent,
    SwitchComponent,
    TableAuditTooltipDirective,
    TableComponent,
    TopBarComponent,
    TranslateModule,
  ],
})
export class CoreModule {}
