import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleetComponent } from './fleet.component';

const routes: Routes = [
  {
    path: '',
    component: FleetComponent,
    children: [
      {
        path: 'aircraft',
        loadChildren: () =>
          import('./components/aircraft/aircraft.module').then(
            (m) => m.AircraftModule
          ),
      },
      {
        path: 'types',
        loadChildren: () =>
          import('./components/fleet-types/fleet-types.module').then(
            (m) => m.FleetTypesModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./components/fleet-categories/fleet-categories.module').then(
            (m) => m.FleetCategoriesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleetRoutingModule {}
