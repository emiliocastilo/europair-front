import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypesRoutingModule } from './fleet-types-routing.module';
import { FleetTypesComponent } from './fleet-types.component';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [FleetTypesComponent],
  imports: [
    CommonModule, FleetTypesRoutingModule, CoreModule
  ]
})
export class FleetTypesModule { }
