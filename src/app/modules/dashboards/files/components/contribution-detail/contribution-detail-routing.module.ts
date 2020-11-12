import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContributionDetailComponent } from './contribution-detail.component';

const routes: Routes = [
  { path: '', component: ContributionDetailComponent },
  {
    path: 'lines/:lineId',
    loadChildren: () =>
      import(
        '../contribution-line-detail/contribution-line-detail.module'
      ).then((m) => m.ContributionLineDetailModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContributionDetailRoutingModule {}
