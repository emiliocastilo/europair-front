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
    data: { title: 'Editar Ruta', isRouteDetail: false },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileDetailRoutingModule {}
