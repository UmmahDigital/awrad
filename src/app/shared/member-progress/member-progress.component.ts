import { Component, Input, OnInit } from '@angular/core';
import { GroupMember } from 'src/app/entities/member';

@Component({
  selector: 'app-member-progress',
  templateUrl: './member-progress.component.html',
  styleUrls: ['./member-progress.component.scss']
})
export class MemberProgressComponent implements OnInit {

  @Input() member: GroupMember;

  progress;

  constructor() { }

  ngOnInit(): void {
    this.progress = this.member.getProgress();
  }

}
