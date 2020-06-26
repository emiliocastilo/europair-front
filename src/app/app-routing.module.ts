import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { AuthGuard } from './core/services/auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => DashboardsModule,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
