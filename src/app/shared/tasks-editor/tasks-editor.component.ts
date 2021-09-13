import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks-editor',
  templateUrl: './tasks-editor.component.html',
  styleUrls: ['./tasks-editor.component.scss']
})
export class TasksEditorComponent implements OnInit {

  tasksStr: string;

  constructor(public dialogRef: MatDialogRef<TasksEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {

    this.tasksStr = data;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(this.tasksStr);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
