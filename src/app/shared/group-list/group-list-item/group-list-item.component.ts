import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'src/app/entities/group';
import { TASK_STATUS } from 'src/app/entities/task-status';
import { GroupService } from 'src/app/group.service';


@Component({
  selector: 'app-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.scss']
})
export class GroupListItemComponent implements OnInit {

  @Input() group: Group;
  link;
  progress;

  TASK_STATUS = TASK_STATUS;

  constructor(private groupsApi: GroupService) { }

  ngOnInit(): void {

    this.progress = this.group.getProgress();
    this.link = this.groupsApi.getGroupURL(this.group.id);
  }

}
