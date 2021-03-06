import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardsComponent } from './dashboards.component';
import { ExampleTableComponent } from './components/example-table/example-table.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardsComponent,
    children: [
      {
        path: 'table',
        component: ExampleTableComponent
      },
      { path: 'tasks', loadChildren: () => import('./masters/tasks/tasks.module').then(m => m.TasksModule) },
      { path: 'roles', loadChildren: () => import('./masters/roles/roles.module').then(m => m.RolesModule) },
      { path: 'users', loadChildren: () => import('./masters/users/users.module').then(m => m.UsersModule) },
      { path: 'countries', loadChildren: () => import('./masters/countries/countries.module').then(m => m.CountriesModule) },
      { path: 'regions', loadChildren: () => import('./masters/regions/regions.module').then(m => m.RegionsModule) },
      { path: 'cities', loadChildren: () => import('./masters/cities/cities.module').then(m => m.CitiesModule) },
      { path: 'airports', loadChildren: () => import('./masters/airports/airports.module').then(m => m.AirportsModule) },
      { path: 'fleet', loadChildren: () => import('./masters/fleet/fleet.module').then(m => m.FleetModule) },
      { path: 'operators', loadChildren: () => import('./masters/operators/operators.module').then(m => m.OperatorsModule) },
      { path: 'contacts', loadChildren: () => import('./masters/contacts/contacts.module').then(m => m.ContactsModule) },
      { path: 'services', loadChildren: () => import('./masters/services/services.module').then(m => m.ServicesModule) },
      { path: 'conditions', loadChildren: () => import('./masters/conditions/conditions.module').then(m => m.ConditionsModule) },
      { path: 'files', loadChildren: () => import('./files/files.module').then(m => m.FilesModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleRoutingModule { }
