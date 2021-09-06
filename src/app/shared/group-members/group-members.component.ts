import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupMember } from 'src/app/entities/member';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {

  @Input() members: GroupMember[];
  @Input() isEditMode: boolean;
  @Output() onMemberClick?= new EventEmitter<GroupMember>();
  @Output() onMemberRemove?= new EventEmitter<GroupMember>();
  @Output() onMemberAdd?= new EventEmitter<GroupMember>();

  newMemberName = "";

  constructor() { }

  ngOnInit(): void {
  }

  memberClicked(member) {
    this.onMemberClick.emit(member);
  }

  removeMember(member) {
    this.onMemberRemove.emit(member);
  }

  addMember(name) {

    let newMember = new GroupMember({
      name: name,
      tasksStatuses: {}
    });

    this.onMemberAdd.emit(newMember);

    this.newMemberName = "";

  }


}
