import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertService } from 'src/app/alert.service';
import { Group } from 'src/app/entities/entities';
import { NativeApiService } from 'src/app/native-api.service';
import { NativeShareService } from 'src/app/native-share.service';
import { GroupService } from '../../../khitma-group.service';


@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupInviteComponent implements OnInit {

  group: Group;
  inviteLink: string;
  inviteMsg: string;

  constructor(private route: ActivatedRoute,
    private groupsApi: GroupService,
    private alert: AlertService,
    private nativeShare: NativeShareService,
    private nativeApi: NativeApiService) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params): void => {

        const groupId = params.groupId;

        this.groupsApi.getGroupDetailsOnce(groupId).subscribe((group: Group) => {
          this.group = group;

          this.inviteLink = this.groupsApi.getGroupURL(this.group.id);

          this.inviteMsg = "إنضمّوا إلى"
            + ' "' + this.group.title + '" '
            + "عبر الرابط "
            + this.inviteLink
            + ". بارك الله فيكم.";

        });

      });

  }

  msgCopied() {

    this.alert.show("تمّ نسخ الرسالة، يمكنك الآن مشاركتها مع معارفك وأصدقائك.", 5000);

  }

  share() {

    this.nativeApi.share("دعوة للإنضمام للمجموعة", this.inviteMsg, null);

  }

}
