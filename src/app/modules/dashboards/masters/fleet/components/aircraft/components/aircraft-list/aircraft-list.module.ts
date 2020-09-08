import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftListRoutingModule } from './aircraft-list-routing.module';
import { AircraftListComponent } from './aircraft-list.component';
import { CoreModule } from 'src/app/core/core.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AircraftListComponent],
  imports: [CommonModule, ReactiveFormsModule, CoreModule, AircraftListRoutingModule],
})
export class AircraftListModule {}
