import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorListComponent } from './operator-list.component';

const routes: Routes = [
  {
    path: '',
    component: OperatorListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorListRoutingModule {}
