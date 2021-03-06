import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypeListRoutingModule } from './fleet-type-list-routing.module';
import { FleetTypeListComponent } from './fleet-type-list.component';
import { CoreModule } from 'src/app/core/core.module';
import { FleetTypesTopBarComponent } from './components/fleet-types-top-bar/fleet-types-top-bar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FleetTypeListComponent, FleetTypesTopBarComponent],
  imports: [CommonModule, ReactiveFormsModule, CoreModule, FleetTypeListRoutingModule],
})
export class FleetTypeListModule {}
