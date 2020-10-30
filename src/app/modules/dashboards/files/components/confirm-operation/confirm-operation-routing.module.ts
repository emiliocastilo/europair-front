import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmOperationComponent } from './confirm-operation.component';

const routes: Routes = [
  { path: '', component: ConfirmOperationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmOperationRoutingModule {}
