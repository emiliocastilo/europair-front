import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { CoreModule } from 'src/app/core/core.module';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TasksComponent, TaskDetailComponent],
  imports: [CommonModule, TasksRoutingModule, CoreModule, ReactiveFormsModule],
})
export class TasksModule {}
