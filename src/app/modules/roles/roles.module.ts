import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';

@NgModule({
  declarations: [RolesComponent, RoleDetailComponent],
  imports: [CommonModule, RolesRoutingModule, CoreModule, ReactiveFormsModule],
})
export class RolesModule {}
