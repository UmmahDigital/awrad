import { Component, Inject, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GroupTask } from 'src/app/entities/group-task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks-composer',
  templateUrl: './tasks-composer.component.html',
  styleUrls: ['./tasks-composer.component.scss']
})
export class TasksComposerComponent implements OnInit {

  public newTaskTitle: string;
  public _tasks: GroupTask[] = [];

  constructor(public dialogRef: MatDialogRef<TasksComposerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupTask[]) {

    data.forEach(val => this._tasks.push(Object.assign({}, val)));
  }

  ngOnInit(): void {

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

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(this._tasks);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }


}
