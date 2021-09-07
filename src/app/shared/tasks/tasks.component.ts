import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupTask } from 'src/app/entities/group-task';
import { TaskStatus, TASK_STATUS } from 'src/app/entities/task-status';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  @Input() tasks: GroupTask[];
  @Input() tasksStatuses: Record<string, TaskStatus>;
  @Output() onToggled?= new EventEmitter<TaskStatus>();

  TASK_STATUS = TASK_STATUS;

  constructor() { }

  ngOnInit(): void {

  }

  taskToggled(task: GroupTask, newStatus: number) {
    this.onToggled.emit(new TaskStatus({
      groupTaskId: task.id,
      status: newStatus
    }));
  }

}
