import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileTrackingComponent } from './file-tracking.component';

const routes: Routes = [{ path: '', component: FileTrackingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileTrackingRoutingModule {}
