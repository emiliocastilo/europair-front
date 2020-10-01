import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [FilesComponent],
  imports: [CommonModule, FilesRoutingModule, CoreModule, MaterialModule],
})
export class FilesModule {}
