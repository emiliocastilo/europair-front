import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypesRoutingModule } from './fleet-types-routing.module';
import { FleetTypesComponent } from './fleet-types.component';
import { CoreModule } from 'src/app/core/core.module';
import { FleetTypeDetailComponent } from './components/fleet-type-detail/fleet-type-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FleetTypesTopBarComponent } from './components/fleet-types-top-bar/fleet-types-top-bar.component';


@NgModule({
  declarations: [FleetTypesComponent, FleetTypeDetailComponent, FleetTypesTopBarComponent],
  imports: [CommonModule, FleetTypesRoutingModule, CoreModule, ReactiveFormsModule]
})
export class FleetTypesModule { }
