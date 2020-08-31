import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AircraftComponent } from './aircraft.component';

const routes: Routes = [
  {
    path: '',
    component: AircraftComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/aircraft-list/aircraft-list.module').then(
            (m) => m.AircraftListModule
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./components/aircraft-detail/aircraft-detail.module').then(
            (m) => m.AircraftDetailModule
          ),
        data: { title: 'AIRCRAFT.NEW', isAircraftDetail: false },
      },
      {
        path: ':aircraftId',
        loadChildren: () =>
          import('./components/aircraft-detail/aircraft-detail.module').then(
            (m) => m.AircraftDetailModule
          ),
        data: { title: 'AIRCRAFT.DETAIL', isAircraftDetail: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AircraftRoutingModule {}
