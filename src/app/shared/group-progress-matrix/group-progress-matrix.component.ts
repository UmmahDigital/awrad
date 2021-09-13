import { Component, Input, OnInit } from '@angular/core';
import { TASK_STATUS } from 'src/app/entities/task-status';

@Component({
  selector: 'app-group-progress-matrix',
  templateUrl: './group-progress-matrix.component.html',
  styleUrls: ['./group-progress-matrix.component.scss']
})
export class GroupProgressMatrixComponent implements OnInit {

  @Input() progressMatrix: number[][];

  TASK_STATUS = TASK_STATUS;

  constructor() { }

  ngOnInit(): void {
  }

}
