import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDatabaseService } from 'src/app/local-database.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GroupService } from 'src/app/group.service';
import { AlertService } from 'src/app/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksComposerComponent } from 'src/app/shared/tasks-composer/tasks-composer.component';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CreateGroupComponent implements OnInit {

  @Output() groupCreated = new EventEmitter<object>();

  groupDetailsFormGroup: FormGroup;

  constructor(private $gaService: GoogleAnalyticsService,
    private groupsApi: GroupService,
    private router: Router,
    private alert: AlertService,
    private localDB: LocalDatabaseService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    this.groupDetailsFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', '']
    });

  }

  createGroup() {

    let title = this.groupDetailsFormGroup.controls['title'].value;
    let description = this.groupDetailsFormGroup.controls['description'].value;
    let author = this.groupDetailsFormGroup.controls['author'].value;

    this.groupsApi.createGroup(title, description, author).then(docRef => {

      const groupId = docRef.id;

      this.$gaService.event('group_created');

      this.alert.show("تمّ إنشاء مجموعة الأوراد بنجاح!", 5000);

      this.localDB.joinGroup(groupId, author);

      this.router.navigateByUrl('/group/' + groupId + '/invite');

    });
  }


  openTasksComposer() {
    const dialogRef = this.dialog.open(TasksComposerComponent, {
      data: [],
      width: "80%",
      height: "80%",
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {


      }

    });
  }


}

