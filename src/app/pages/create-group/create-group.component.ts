import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDatabaseService } from 'src/app/local-database.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GroupService } from 'src/app/group.service';
import { AlertService } from 'src/app/alert.service';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CreateGroupComponent implements OnInit {

  @Output() groupCreated = new EventEmitter<object>();

  title: string;
  description: string;
  author: string;


  typeParam: string;

  isRecurring = true;

  constructor(private $gaService: GoogleAnalyticsService,
    private groupsApi: GroupService,
    private router: Router,
    private alert: AlertService,
    private localDB: LocalDatabaseService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.typeParam = params['type'];

      if (!this.typeParam) {
        return;
      }

    });

  }

  createGroup() {


    this.groupsApi.createGroup(this.title, this.description, this.author).then(docRef => {

      const groupId = docRef.id;

      this.$gaService.event('group_created');

      this.alert.show("تمّ إنشاء مجموعة الأوراد بنجاح!", 5000);


      this.localDB.joinGroup(groupId, this.author);

      this.router.navigateByUrl('/group/' + groupId + '/invite');


    });
  }



}

