import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FileAuditRoutingModule } from './file-audit-routing.module';
import { FileAuditComponent } from './file-audit.component';

@NgModule({
  declarations: [FileAuditComponent],
  imports: [CommonModule, CoreModule, MaterialModule, FileAuditRoutingModule, ReactiveFormsModule],
})
export class FileAuditModule {}
