import { Component, Input, OnInit } from '@angular/core';
import { GroupMember } from 'src/app/entities/member';
import { TASK_STATUS } from 'src/app/entities/task-status';

@Component({
  selector: 'app-member-progress',
  templateUrl: './member-progress.component.html',
  styleUrls: ['./member-progress.component.scss']
})
export class MemberProgressComponent implements OnInit {

  @Input() member: GroupMember;

  TASK_STATUS = TASK_STATUS;

  progress;

  constructor() { }

  ngOnInit(): void {
    this.progress = this.member.getProgress();
  }

}
