import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Group } from 'src/app/entities/group';
import { GroupService } from 'src/app/group.service';
import { LocalDatabaseService } from 'src/app/local-database.service';

@Component({
  selector: 'app-group-join',
  templateUrl: './group-join.component.html',
  styleUrls: ['./group-join.component.scss']
})
export class GroupJoinComponent implements OnInit {

  group: Group;
  inviteLink: string;
  username: string;

  constructor(
    private groupsApi: GroupService,
    private localDB: LocalDatabaseService,
    private $gaService: GoogleAnalyticsService,
    private router: Router,
    private _ngZone: NgZone) {
  }

  ngOnInit() {

    this.groupsApi.getCurrentGroup().subscribe(
      (value: Group) => this.group = value
    )

  }

  join() {

    this.$gaService.event('group_joined');

    let username = Group.refineUsername(this.username);

    this.localDB.joinGroup(this.group.id, username);

    this.groupsApi.addGroupMember(this.group.id, username).then(() => {
      window.location.reload();
    });


    // this.router.navigate(['/group', this.group.id, 'dashboard']);

    // this._ngZone.run(() => { this.router.navigate(['/group', this.group.id, 'dashboard']) });



  }


}
