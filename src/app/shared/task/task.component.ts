import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskStatus, TASK_STATUS } from 'src/app/entities/task-status';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() status: number;
  @Output() onToggled?= new EventEmitter<number>();

  TASK_STATUS = TASK_STATUS;

  constructor() { }

  ngOnInit(): void {
  }

  toggled() {
    this.status = TaskStatus.getNextStatus(this.status);
    this.onToggled.emit(this.status);
  }

}
