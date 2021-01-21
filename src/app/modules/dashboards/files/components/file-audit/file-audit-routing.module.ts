import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileAuditComponent } from './file-audit.component';

const routes: Routes = [{ path: '', component: FileAuditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileAuditRoutingModule { }
