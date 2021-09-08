import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GroupTask } from 'src/app/entities/group-task';

@Component({
  selector: 'app-tasks-composer',
  templateUrl: './tasks-composer.component.html',
  styleUrls: ['./tasks-composer.component.scss']
})
export class TasksComposerComponent implements OnInit {

  @Input() givenTasks: GroupTask[];

  public newTaskTitle: string;
  public _tasks: GroupTask[] = [];

  constructor() { }

  ngOnInit(): void {


    if (this.givenTasks) {
      this._tasks = { ...this.givenTasks };
    }
  }

  reorderList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this._tasks, event.previousIndex, event.currentIndex);
  }

  addTask(newTaskTitle) {
    let newTask = new GroupTask({
      title: newTaskTitle
    });

    this._tasks.push(newTask);

    // this.onMemberAdd.emit(newMember);

    this.newTaskTitle = "";
  }

}
