import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/alert.service';
import { NewTaskComponent } from 'src/app/dialog/new-task/new-task.component';
import { Group } from 'src/app/entities/group';
import { GroupMember } from 'src/app/entities/member';
import { TaskStatus, TASK_STATUS } from 'src/app/entities/task-status';
import { GroupService } from 'src/app/group.service';
import { LocalDatabaseService } from 'src/app/local-database.service';
import { NativeApiService } from 'src/app/native-api.service';
import { NativeShareService } from 'src/app/native-share.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Input() groupWatch$: Subject<Group>;
  @Input() userWatch$?: Subject<string>;

  @Input() isAdmin: boolean;
  @Input() username: string;

  @Output() onAchievement?= new EventEmitter();

  TASK_STATUS = TASK_STATUS;

  isMembersListEditMode = false;
  showGroupMembers = true;

  myMember;
  progress;
  totalDoneTasks;

  constructor(private groupsApi: GroupService,
    private localDB: LocalDatabaseService,
    private dialog: MatDialog,
    private $gaService: GoogleAnalyticsService,
    private titleService: Title,
    private alert: AlertService,
    private nativeApi: NativeApiService,
    private nativeShare: NativeShareService,
    private router: Router,) {


  }

  ngOnInit(): void {
    // this.showGroupMembers = this.isAdmin;

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.myMember = this.group.getMember(this.username);
    this.progress = this.group.getProgress();
    this.totalDoneTasks = this.group.totalDoneTasks || 0;

  }

  taskToggled(newTaskStatus: TaskStatus) {

    this.groupsApi.updateMemberTask(this.group.id, this.username, newTaskStatus.groupTaskId, newTaskStatus.status);

    if (newTaskStatus.status === TASK_STATUS.DONE) {
      this.onAchievement.emit();
    }

    // analytics:

    let newStatusTitle = "task_done";
    switch (newTaskStatus.status) {
      case TASK_STATUS.DONE: newStatusTitle = "task_done"; break;
      case TASK_STATUS.DOING: newStatusTitle = "task_done"; break;
      case TASK_STATUS.TODO: newStatusTitle = "task_done"; break;
    }
    this.$gaService.event(newStatusTitle, 'tasks', this.group.getTask(newTaskStatus.groupTaskId).title);

  }


  // updateTask(newTask) {

  //   let tmpGroup = (<Group>this.group);
  //   tmpGroup.resetMembersTaskStatus();

  //   let membersObj = tmpGroup.getMembersObj();

  //   this.groupsApi.updateGroupTask(this.group.id, newTask, this.group.cycle, membersObj);

  //   this.$gaService.event('new_task', 'tasks', newTask);

  // }


  // toggleMemberTaskState(member: GroupMember) {

  //   if (!this.isAdmin) {
  //     return;
  //   }

  //   member.isTaskDone = !member.isTaskDone;
  //   this.groupsApi.updateMemberTask(this.group.id, member.name, member.isTaskDone);


  //   this.$gaService.event(member.isTaskDone ? 'task_done' : 'task_undone', 'tasks', (<Group>this.group).task);


  // }

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


  showNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: "90%"
    });

    dialogRef.afterClosed().subscribe(newTask => {

      if (newTask) {

        // this.updateTask(newTask);

      }

    });

  }

}
