import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableComponent } from './components/table/table.component';
import { RouterModule } from '@angular/router';
import { CheckboxComponent } from './components/basic/checkbox/checkbox.component';
import { InputTextComponent } from './components/basic/input-text/input-text.component';
import { LeftSidebarComponent } from './components/menus/left-sidebar/left-sidebar.component';




@NgModule({
  declarations: [TableComponent, CheckboxComponent
    , InputTextComponent, LeftSidebarComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TableComponent, LeftSidebarComponent
  ]
})
export class CoreModule { }
