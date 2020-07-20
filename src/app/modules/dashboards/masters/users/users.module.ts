import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [UsersComponent, UserDetailComponent],
  imports: [CommonModule, UsersRoutingModule, CoreModule, ReactiveFormsModule],
})
export class UsersModule {}
