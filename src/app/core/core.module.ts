import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from '../material/material.module';
import { AutocompleteComponent } from './components/basic/autocomplete/autocomplete.component';
import { CheckboxComponent } from './components/basic/checkbox/checkbox.component';
import { InputMaskComponent } from './components/basic/input-mask/input-mask.component';
import { InputTextComponent } from './components/basic/input-text/input-text.component';
import { InputComponent } from './components/basic/input/input.component';
import { SelectComponent } from './components/basic/select/select.component';
import { SwitchComponent } from './components/basic/switch/switch.component';
import { AdvancedSearchComponent } from './components/menus/advanced-search/advanced-search.component';
import { ButtonBarComponent } from './components/menus/button-bar/button-bar.component';
import { LeftSidebarComponent } from './components/menus/left-sidebar/left-sidebar.component';
import { MobileBarComponent } from './components/menus/mobile-bar/mobile-bar.component';
import { PageBarComponent } from './components/menus/page-bar/page-bar.component';
import { SearchBarComponent } from './components/menus/search-bar/search-bar.component';
import { SortMenuComponent } from './components/menus/sort-menu/sort-menu.component';
import { TopBarComponent } from './components/menus/top-bar/top-bar.component';
import { ModalComponent } from './components/modal/modal.component';
import { TranslatedSnackBarComponent } from './components/snack-bar/translated-snack-bar/translated-snack-bar.component';
import { ColumnActionsComponent } from './components/table/components/column-actions/column-actions.component';
import { ColumnCheckboxComponent } from './components/table/components/column-checkbox/column-checkbox.component';
import { LetterTableComponent } from './components/table/components/letter-table/letter-table.component';
import { PaginationComponent } from './components/table/components/pagination/pagination.component';
import { SortButtonComponent } from './components/table/components/sort-button/sort-button.component';
import { TableComponent } from './components/table/table.component';
import { MatCollapsibleDirective } from './directives/mat-collapsible.directive';
import { MatDropdownDirective } from './directives/mat-dropdown.directive';
import { MatTooltipDirective } from './directives/mat-tooltip.directive';
import { TableAuditTooltipDirective } from './directives/table-audit-tooltip.directive';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { ConfirmOperationDialogComponent } from './components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { EditableComponent } from './components/editable/editable.component';
import { ViewModeDirective } from './components/editable/view-mode.directive';
import { EditModeDirective } from './components/editable/edit-mode.directive';
import { EditOnEnterDirective } from './components/editable/edit-on-enter.directive';
import { FocusableDirective } from './directives/focusable.directive';
import { MaxlengthDirective } from './directives/maxlength.directive';
import { SelectFormComponent } from './components/basic/select-form/select-form.component';

@NgModule({
  declarations: [
    AdvancedSearchComponent,
    ButtonBarComponent,
    CheckboxComponent,
    CheckboxComponent,
    ColumnActionsComponent,
    ColumnCheckboxComponent,
    InputComponent,
    InputMaskComponent,
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
    SelectFormComponent,
    SentenceCasePipe,
    SortButtonComponent,
    SortMenuComponent,
    SwitchComponent,
    TableAuditTooltipDirective,
    TableComponent,
    TopBarComponent,
    TranslatedSnackBarComponent,
    AutocompleteComponent,
    ConfirmOperationDialogComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    EditOnEnterDirective,
    FocusableDirective,
    MaxlengthDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    TranslateModule,
    NgxMaskModule,
  ],
  exports: [
    AutocompleteComponent,
    AdvancedSearchComponent,
    ButtonBarComponent,
    CheckboxComponent,
    InputComponent,
    InputMaskComponent,
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
    SelectFormComponent,
    SentenceCasePipe,
    SortMenuComponent,
    SwitchComponent,
    TableAuditTooltipDirective,
    TableComponent,
    TopBarComponent,
    TranslateModule,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    EditOnEnterDirective,
    FocusableDirective,
    MaxlengthDirective,
  ],
})
export class CoreModule {}
