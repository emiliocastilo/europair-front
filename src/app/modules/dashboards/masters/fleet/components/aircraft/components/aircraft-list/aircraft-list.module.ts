import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftListRoutingModule } from './aircraft-list-routing.module';
import { AircraftListComponent } from './aircraft-list.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [AircraftListComponent],
  imports: [CommonModule, CoreModule, AircraftListRoutingModule],
})
export class AircraftListModule {}
