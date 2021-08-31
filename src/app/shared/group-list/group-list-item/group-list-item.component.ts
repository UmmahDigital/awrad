import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from '../../../../app/khitma-group.service';
import { GroupMember } from '../../../entities/entities';

@Component({
  selector: 'app-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.scss']
})
export class GroupListItemComponent implements OnInit {

  @Input() group;

  link;

  progress;

  constructor(private groupsApi: GroupService) { }

  ngOnInit(): void {
    this.progress = this.calcProgress_SameTask();
    this.link = this.groupsApi.getGroupURL(this.group.id);
  }

  calcProgress_SameTask() {

    let counters = {
      done: 0,
      idle: 0
    };

    for (let [name, value] of Object.entries(this.group.members)) {

      let m = <GroupMember>value;

      if (m.isTaskDone) {
        counters["done"]++;
      }
      else {
        counters["idle"]++;
      }

    }

    return counters;

  }


}
