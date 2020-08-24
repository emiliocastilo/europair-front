import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FleetTypesRoutingModule } from './fleet-types-routing.module';
import { FleetTypesComponent } from './fleet-types.component';

@NgModule({
  declarations: [FleetTypesComponent],
  imports: [CommonModule, FleetTypesRoutingModule],
})
export class FleetTypesModule {}
