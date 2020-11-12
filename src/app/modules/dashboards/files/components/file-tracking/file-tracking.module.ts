import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTrackingRoutingModule } from './file-tracking-routing.module';
import { FileTrackingComponent } from './file-tracking.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FileTrackingComponent],
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    FileTrackingRoutingModule,
    ReactiveFormsModule
  ],
})
export class FileTrackingModule {}
