import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightTrackingDetailComponent } from './components/flight-tracking-detail/flight-tracking-detail.component';
import { FlightTrackingComponent } from './flight-tracking.component';

const routes: Routes = [
  { path: '', component: FlightTrackingComponent },
  { path: ':flightId', component: FlightTrackingDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightTrackingRoutingModule {}
