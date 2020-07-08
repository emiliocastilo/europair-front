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
      { path: 'tasks', loadChildren: () => import('../tasks/tasks.module').then(m => m.TasksModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleRoutingModule { }
