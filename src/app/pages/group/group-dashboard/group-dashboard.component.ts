import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LocalDatabaseService } from 'src/app/local-database.service';

import { MatDialog } from '@angular/material/dialog';


import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'src/app/alert.service';
import { NativeApiService } from 'src/app/native-api.service';
import { EditGroupDetailsComponent } from 'src/app/dialog/edit-group-details/edit-group-details.component';
import { Router } from '@angular/router';
import { StatusMessages } from './status-messages';
import { Subject } from 'rxjs';
import { GroupComponent } from './group-types/sametask/group.component';
import { GroupService } from 'src/app/group.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Group } from 'src/app/entities/group';


@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupDashboardComponent implements OnInit {

  @ViewChild(GroupComponent) groupChildComponent: GroupComponent;

  group;// : Group_Sequential | Group_SameTask;


  username: string;
  isAdmin: boolean = false;
  showCelebration: boolean = false;
  isGroupInfoExpanded: false;
  isInitiated = false;

  userWatch$: Subject<string> = new Subject();

  inviteMsg = "";
  statusMsg = "";

  constructor(private groupsApi: GroupService,
    private localDB: LocalDatabaseService,
    private dialog: MatDialog,
    private $gaService: GoogleAnalyticsService,
    private titleService: Title,
    private alert: AlertService,
    private nativeApi: NativeApiService,
    private router: Router,) {
  }

  ngOnInit(): void {

    this.groupsApi.getCurrentGroup().subscribe((group: Group) => {

      this.titleService.setTitle(group.title);


      if (!group) {
        return;
      }

      this.group = new Group(group);

      if (!this.isInitiated) {
        this.username = this.localDB.getUsername(this.group.id);
        this.isAdmin = this.group.isAdmin(this.username);
        this.isInitiated = true;
      }

      this.inviteMsg = "إنضمّوا إلى مجموعة"
        + ' "' + this.group.title + '" '
        + "عبر الرابط "
        + this.group.getURL();

    });

  }

  getGroupStatusMsg() {
    return StatusMessages.fromGroup(this.group);
  }


  celebrate() {
    this.showCelebration = true;

    setTimeout(() => {
      this.showCelebration = false;
    }, 5000);
  }

  shareStatusMsg() {
    this.nativeApi.share(("وضع المجموعة: " + this.group.title), this.getGroupStatusMsg(), null);
  }

  shareStatusMsgWhatsapp() {

    const link = "//wa.me/?text=" + this.getGroupStatusMsg();
    window.open(link, '_blank');

  }


  shareInviteMsg() {
    this.nativeApi.share(("دعوة انضمام: " + this.group.title), this.inviteMsg, null);
  }


  showEditGroupDialog() {

    const dialogRef = this.dialog.open(EditGroupDetailsComponent, {
      data: {
        title: this.group.title,
        author: this.group.author,
        descreption: this.group.description,
        targetDate: this.group.targetDate,
        admins: this.group.admins,
      },
      maxWidth: "80%"
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {

        this.groupsApi.updateGroupInfo(this.group.id,
          dialogResult.title,
          dialogResult.description,
          dialogResult.targetDate,
          dialogResult.admins
        );

      }

    });

  }

  leaveGroup() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        "تأكيد ترك المجموعة",
        "لا ننصح بترك المجموعة كي لا يفوتك الثواب العظيم إن شاء الله، لكن في حال تركت المجموعة فسيتم إتاحة جزئك من جديد وتحويلك للصفحة الرئيسية."),
      maxWidth: "80%"
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {

        this.$gaService.event('group_leave');


        this.userWatch$.next('user-leave-group'); // update the children

        this.localDB.archiveGroup(this.group);

        this.groupsApi.removeGroupMember(this.group.id, this.username).then(() => {
          this.router.navigate(['/']);

        });

      }

    });

  }




}
