import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Group } from 'src/app/entities/entities';
import { GroupService } from 'src/app/group.service';


@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class GroupInfoComponent implements OnInit {

  @Input() group: Group;
  @Input() showLink?: boolean;
  @Input() isExpanded?: boolean;

  groupLink: string;

  constructor(private groupsApi: GroupService) { }

  ngOnInit(): void {

    if (this.showLink) {
      this.groupLink = this.groupsApi.getGroupURL(this.group.id);
    }
  }



}
