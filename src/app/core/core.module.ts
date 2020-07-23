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
import { SelectComponent } from './components/basic/select/select.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    TableComponent,
    CheckboxComponent,
    InputTextComponent,
    LeftSidebarComponent,
    PageBarComponent,
    LetterTableComponent,
    ColumnActionsComponent,
    ColumnCheckboxComponent,
    ModalComponent,
    ButtonBarComponent,
    MobileBarComponent,
    PaginationComponent,
    MatCollapsibleDirective,
    SelectComponent
  ],
  imports: [CommonModule, RouterModule, NgSelectModule ],
  exports: [
    TableComponent,
    LeftSidebarComponent,
    PageBarComponent,
    InputTextComponent,
    SelectComponent,
    ModalComponent,
    ButtonBarComponent,
    MobileBarComponent,
    MatCollapsibleDirective
  ],
})
export class CoreModule {}
