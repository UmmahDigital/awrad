import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/entities/entities';

@Component({
  selector: 'app-edit-group-details',
  templateUrl: './edit-group-details.component.html',
  styleUrls: ['./edit-group-details.component.scss']
})
export class EditGroupDetailsComponent implements OnInit {

  group: Group;

  constructor(public dialogRef: MatDialogRef<EditGroupDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group) {

    this.group = data;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(this.group);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
