import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AircraftComponent } from './aircraft.component';

const routes: Routes = [{ path: '', component: AircraftComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AircraftRoutingModule {}
