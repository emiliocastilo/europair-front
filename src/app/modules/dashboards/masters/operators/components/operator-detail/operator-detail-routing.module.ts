import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorDetailComponent } from './operator-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OperatorDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatorDetailRoutingModule {}
