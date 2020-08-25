import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { OperatorDetailRoutingModule } from './operator-detail-routing.module';
import { OperatorDetailComponent } from './operator-detail.component';
import { DetailCertificationsComponent } from './components/detail-certifications/detail-certifications.component';
import { DetailCommentsComponent } from './components/detail-comments/detail-comments.component';

@NgModule({
  declarations: [OperatorDetailComponent, DetailCertificationsComponent, DetailCommentsComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    OperatorDetailRoutingModule,
  ],
})
export class OperatorDetailModule {}
