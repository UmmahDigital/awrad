import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Group } from '../../entities/entities';
import { GroupService } from '../../khitma-group.service';
import { LocalDatabaseService } from '../../local-database.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @Input() groups: Group[];
  @Output() onAction = new EventEmitter<object>();

  showSettings: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  action(group) {
    this.onAction.emit(group);
  }

}
