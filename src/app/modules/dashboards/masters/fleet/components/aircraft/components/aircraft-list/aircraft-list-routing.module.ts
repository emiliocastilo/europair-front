import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AircraftListComponent } from './aircraft-list.component';

const routes: Routes = [
  {
    path: '',
    component: AircraftListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AircraftListRoutingModule {}
