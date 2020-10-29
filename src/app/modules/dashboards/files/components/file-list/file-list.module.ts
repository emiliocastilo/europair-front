import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FileListRoutingModule } from './file-list-routing.module';
import { FileListComponent } from './file-list.component';

@NgModule({
  declarations: [FileListComponent],
  imports: [CommonModule, CoreModule, MaterialModule, FileListRoutingModule, ReactiveFormsModule],
})
export class FileListModule {}
