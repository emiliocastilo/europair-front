import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlightTrackingRoutingModule } from './flight-tracking-routing.module';
import { FlightTrackingComponent } from './flight-tracking.component';
import { FlightTrackingDetailComponent } from './components/flight-tracking-detail/flight-tracking-detail.component';

@NgModule({
  declarations: [FlightTrackingComponent, FlightTrackingDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    FlightTrackingRoutingModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe]
})
export class FlightTrackingModule {}
