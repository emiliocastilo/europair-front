import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FileContractsComponent } from './components/file-contracts.component';
import { FileDetailRoutingModule } from './file-detail-routing.module';
import { FileDetailComponent } from './file-detail.component';

@NgModule({
  declarations: [FileDetailComponent, FileContractsComponent],
  imports: [
    CommonModule,
    CoreModule,
    FileDetailRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class FileDetailModule {}
