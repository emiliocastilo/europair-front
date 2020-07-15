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
      { path: 'countries', loadChildren: () => import('../countries/countries.module').then(m => m.CountriesModule) },
      { path: 'regions', loadChildren: () => import('./masters/regions/regions.module').then(m => m.RegionsModule) },
      { path: 'cities', loadChildren: () => import('../cities/cities.module').then(m => m.CitiesModule) }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleRoutingModule { }
