import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightTrackingRoutingModule } from './flight-tracking-routing.module';
import { FlightTrackingComponent } from './flight-tracking.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FlightTrackingComponent],
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    FlightTrackingRoutingModule,
    ReactiveFormsModule
  ],
})
export class FlightTrackingModule {}
