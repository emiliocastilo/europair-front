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
      { path: 'tasks', loadChildren: () => import('../tasks/tasks.module').then(m => m.TasksModule) },
      { path: 'roles', loadChildren: () => import('../roles/roles.module').then(m => m.RolesModule) },
      { path: 'users', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
      { path: 'countries', loadChildren: () => import('../countries/countries.module').then(m => m.CountriesModule) }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleRoutingModule { }
