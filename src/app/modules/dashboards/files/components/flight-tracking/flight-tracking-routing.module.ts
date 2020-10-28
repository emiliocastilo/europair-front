import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightTrackingComponent } from './flight-tracking.component';

const routes: Routes = [{ path: '', component: FlightTrackingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightTrackingRoutingModule {}
