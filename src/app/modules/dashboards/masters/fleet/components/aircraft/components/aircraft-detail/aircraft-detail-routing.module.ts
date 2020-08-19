import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AircraftDetailComponent } from './aircraft-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AircraftDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AircraftDetailRoutingModule {}
