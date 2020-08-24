import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleetTypesComponent } from './fleet-types.component';

const routes: Routes = [
  {
    path: '',
    component: FleetTypesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/fleet-type-list/fleet-type-list.module').then(
            (m) => m.FleetTypeListModule
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import(
            './components/fleet-type-detail/fleet-type-detail.module'
          ).then((m) => m.FleetTypeDetailModule),
        data: { title: 'fleet-types.new', isAircraftDetail: false },
      },
      {
        path: ':typeId',
        loadChildren: () =>
          import(
            './components/fleet-type-detail/fleet-type-detail.module'
          ).then((m) => m.FleetTypeDetailModule),
        data: { title: 'fleet-types.detail', isAircraftDetail: true },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleetTypesRoutingModule {}
