import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContributionLineDetailComponent } from './contribution-line-detail.component';

const routes: Routes = [{ path: '', component: ContributionLineDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionLineDetailRoutingModule { }
