import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './files.component';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/file-list/file-list.module').then(
            (m) => m.FileListModule
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./components/file-detail/file-detail.module').then(
            (m) => m.FileDetailModule
          ),
        data: { title: 'Nuevo Expediente', isFileDetail: false },
      },
      {
        path: ':fileId',
        loadChildren: () =>
          import('./components/file-detail/file-detail.module').then(
            (m) => m.FileDetailModule
          ),
        data: { title: 'Detalles Tipo', isFileDetail: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesRoutingModule {}