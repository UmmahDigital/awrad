import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { GroupService } from 'src/app/group.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Group } from 'src/app/entities/group';
import { TaskStatus, TASK_STATUS } from 'src/app/entities/task-status';
import { GroupMember } from 'src/app/entities/member';
import { TasksEditorComponent } from 'src/app/shared/tasks-editor/tasks-editor.component';
import { GroupTask } from 'src/app/entities/group-task';


@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupDashboardComponent implements OnInit {


  group: Group;

  username: string;
  isAdmin: boolean = false;
  showCelebration: boolean = false;
  isGroupInfoExpanded: false;
  isInitiated = false;

  inviteMsg = "";
  statusMsg = "";

  TASK_STATUS = TASK_STATUS;

  isMembersListEditMode = false;
  showGroupMembers = true;

  tasks;

  myMember;
  progress;
  progressMatrix;
  totalDoneTasks;



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

      this.group = group;

      if (!this.isInitiated) {
        this.username = this.localDB.getUsername(this.group.id);
        this.isAdmin = this.group.isAdmin(this.username);

        this.inviteMsg = "إنضمّوا إلى مجموعة"
          + ' "' + this.group.title + '" '
          + "عبر الرابط "
          + this.group.getURL();

        this.isInitiated = true;

      }

      this.myMember = this.group.getMember(this.username);
      this.progress = this.group.getProgress();
      this.progressMatrix = this.group.getProgressMatrix();
      this.totalDoneTasks = this.group.totalDoneTasks || 0;

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

        this.localDB.archiveGroup(this.group);

        this.groupsApi.removeGroupMember(this.group.id, this.username).then(() => {
          this.router.navigate(['/']);

        });

      }

    });

  }


  // GROUP


  taskToggled(newTaskStatus: TaskStatus) {

    this.groupsApi.updateMemberTask(this.group.id, this.username, newTaskStatus.groupTaskId, newTaskStatus.status);

    if (newTaskStatus.status === TASK_STATUS.DONE) {
      this.celebrate();
    }

    // analytics:

    let newStatusTitle = "task_done";
    switch (newTaskStatus.status) {
      case TASK_STATUS.DONE: newStatusTitle = "task_status_done"; break;
      case TASK_STATUS.DOING: newStatusTitle = "task_status_doing"; break;
      case TASK_STATUS.TODO: newStatusTitle = "task_status_todo"; break;
    }
    this.$gaService.event(newStatusTitle, 'tasks', this.group.getTask(newTaskStatus.groupTaskId).title);

  }

  removeGroupMember(member: GroupMember) {


    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        "تأكيد حذف عضو المجموعة",
        ""),
      maxWidth: "80%"
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        this.groupsApi.removeGroupMember(this.group.id, member.name);
        this.alert.show("تمّ حذف  " + member.name + "  بنجاح", 2500);
      }

    });

  }


  addGroupMember(member: GroupMember) {
    this.groupsApi.addGroupMember(this.group.id, member.name);
    this.alert.show("تمّ إضافة  " + member.name + "  بنجاح", 2500);
  }

  showTasksEditor() {

    let oldTasks = { ...this.group.getTasks() };

    const dialogRef = this.dialog.open(TasksEditorComponent, {
      data: this.group.getTasksString(),
      maxWidth: "80%",
      minHeight: "50%"
    });

    dialogRef.afterClosed().subscribe(newTasksText => {

      if (newTasksText) {

        let newTasks = GroupTask.textToGroupTaskList(newTasksText);
        this._replaceTasks(oldTasks, newTasks);

      }

    });

  }


  private _replaceTasks(oldTasks: GroupTask[], newTasks: GroupTask[]) {

    let oldTaskIdTextMap = {};
    let lastId = -1;

    Object.values(oldTasks).forEach(task => {
      oldTaskIdTextMap[task.title] = task.id;

      if (task.id > lastId) {
        lastId = task.id;
      }
    });

    Object.values(newTasks).forEach(newTask => {
      newTask.id = oldTaskIdTextMap[newTask.title] ? oldTaskIdTextMap[newTask.title].id : lastId++;

    });

    // ******


    let newTaskIdTextMap = {};
    Object.values(newTasks).forEach(newTask => {
      newTaskIdTextMap[newTask.title] = newTask.id;
    });

    Object.values(oldTasks).forEach(task => {
      if (!newTaskIdTextMap[task.title]) {

        Object.values(this.group.membersTasksStatuses).forEach(_memberTasksStatuses => {
          Object.values(_memberTasksStatuses).forEach(taskStatus => {
            if (taskStatus.groupTaskId == task.id) {
              delete _memberTasksStatuses[task.id];
            }
          });
        });

      }
    });

    this.group.tasks = newTasks;
    this.groupsApi.updateGroupTasks(this.group.id, this.group.tasks, this.group.membersTasksStatuses, false);

  }


}
