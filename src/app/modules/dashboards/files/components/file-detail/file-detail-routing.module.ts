import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDetailComponent } from './file-detail.component';

const routes: Routes = [
  { path: '', component: FileDetailComponent },
  {
    path: 'routes/new',
    loadChildren: () =>
      import('../route-detail/route-detail.module').then(
        (m) => m.RouteDetailModule
      ),
    data: { title: 'FILES.NEW_ROUTE', isRouteDetail: false },
  },
  {
    path: 'routes/:routeId',
    loadChildren: () =>
      import('../route-detail/route-detail.module').then(
        (m) => m.RouteDetailModule
      ),
    data: { title: 'FILES.COPY_ROUTE', isRouteDetail: true },
  },
  {
    path: 'routes/:routeId/rotations/:rotationId',
    loadChildren: () =>
      import('../rotation-detail/rotation-detail.module').then(
        (m) => m.RotationDetailModule
      ),
    data: { title: 'Editar Rotacion', isRouteDetail: false },
  },
  {
    path: 'additional-services',
    loadChildren: () =>
      import('../additional-services/additional-services.module').then(
        (m) => m.AditionalServicesModule
      ),
    data: { title: 'NEW', isRouteDetail: false },
  },
  {
    path: 'routes/:routeId/contributions/:contributionId',
    loadChildren: () =>
      import('../contribution-detail/contribution-detail.module').then(
        (m) => m.ContributionDetailModule
      ),
  },
  {
    path: 'confirm-operation',
    loadChildren: () =>
      import('../confirm-operation/confirm-operation.module').then(
        (m) => m.ConfirmOperationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileDetailRoutingModule {}
