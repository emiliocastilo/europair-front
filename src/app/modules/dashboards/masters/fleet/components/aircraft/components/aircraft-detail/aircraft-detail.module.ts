import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftDetailRoutingModule } from './aircraft-detail-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AircraftDetailComponent } from './aircraft-detail.component';
import { BaseDetailComponent } from './components/base-detail/base-detail.component';
import { ObservationDetailComponent } from './components/observation-detail/observation-detail.component';

@NgModule({
  declarations: [AircraftDetailComponent, BaseDetailComponent, ObservationDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    AircraftDetailRoutingModule,
  ],
})
export class AircraftDetailModule {}
