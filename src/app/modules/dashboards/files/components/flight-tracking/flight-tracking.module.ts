import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightTrackingRoutingModule } from './flight-tracking-routing.module';
import { FlightTrackingComponent } from './flight-tracking.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [FlightTrackingComponent],
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    FlightTrackingRoutingModule,
  ],
})
export class FlightTrackingModule {}
