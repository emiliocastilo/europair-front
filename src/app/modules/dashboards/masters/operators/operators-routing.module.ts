import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperatorsComponent } from './operators.component';

const routes: Routes = [
  {
    path: '',
    component: OperatorsComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/operator-list/operator-list.module').then(
            (m) => m.OperatorListModule
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./components/operator-detail/operator-detail.module').then(
            (m) => m.OperatorDetailModule
          ),
        data: { title: 'Nuevo aeropuerto', isOperatorDetail: false },
      },
      {
        path: ':operatorId',
        loadChildren: () =>
        import('./components/operator-detail/operator-detail.module').then(
          (m) => m.OperatorDetailModule
          ),
        data: { title: 'Detalle aeropuerto', isOperatorDetail: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorsRoutingModule {}
