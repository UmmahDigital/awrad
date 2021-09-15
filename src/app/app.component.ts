import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { PwaService } from './pwa.service';
import { PopMenuComponent } from './shared/pop-menu/pop-menu.component';

import { AngularFireMessaging } from '@angular/fire/messaging';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {



  isPwaInstalled = false;
  menuDialogRef;

  isDarkStyle = false;

  constructor(public pwa: PwaService, private dialog: MatDialog, private router: Router, private afMessaging: AngularFireMessaging,
    private notificationService: NotificationService) {

    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isPwaInstalled = true;
    }

    this.router.events.subscribe((event: Event) => {


      if (event instanceof NavigationStart) { // NavigationEnd
        if (this.menuDialogRef) {
          this.menuDialogRef.close();
        }
      }
      else if (event instanceof NavigationEnd) {
        this.isDarkStyle = event.url === "/ramadan";

        // window.scroll(0, 0);

        document.querySelector('#app-content').scrollTo(0, 0);



      }



    });

  }

  installPwa(): void {
    if (this.pwa.promptEvent) {
      this.pwa.promptEvent.prompt();
    }
  }

  openMenu() {
    this.menuDialogRef = this.dialog.open(PopMenuComponent, {
      maxWidth: "80%"
    });

  }

  ngOnInit() {
    this.requestPermission();
    this.listen();
  }

  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          // TODO: send token to server
        },
        (error) => { console.error(error); },
      );
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message: any) => {
        console.log(message);
        this.notificationService.setNotification({
          body: message.notification.body,
          title: message.notification.title,
          isVisible: true
        })
      });
  }

}
