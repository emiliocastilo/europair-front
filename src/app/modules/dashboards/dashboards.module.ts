import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExampleRoutingModule } from './dashboards-routing.module';
import { DashboardsComponent } from './dashboards.component';
import { CoreModule } from 'src/app/core/core.module';
import { ExampleTableComponent } from './components/example-table/example-table.component';


@NgModule({
  declarations: [DashboardsComponent, ExampleTableComponent],
  imports: [
    CommonModule,
    ExampleRoutingModule,
    CoreModule
  ]
})
export class DashboardsModule { }
