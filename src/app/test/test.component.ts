import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, catchError, take, first } from 'rxjs/operators';

// import * as firestore from "../../../node_modules/firebase";
import { GroupService } from '../group.service';


import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Group } from '../entities/group';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private db: AngularFirestore, private groupsApi: GroupService) { }

  ngOnInit(): void {
  }

  clicked() {

    for (let i = 0; i < 30; i++) {

      let updatedObj = {};
      updatedObj[("ajza." + i)] = {
        index: i,
        owner: "hasan" + (i + 1)
      };

      this.db.doc<Group>('groups/O5Nd5fcQ9Kx59aYTrGPp').update(updatedObj);

    }



    // this.db.doc<SameTaskGroup>('groups/JQQVZKetquaDjvtDhFvj').update({ "task": "مهمة جديدة" });


    // *****

    // let updatedObj = {};
    // updatedObj[("members." + "سجود")] = {
    //   name: "سجود",
    //   isTaskDone: false
    // };

    // this.db.doc<Group>('groups/' + "JQQVZKetquaDjvtDhFvj").update(updatedObj);




    // ****
    let updatedObj = {};
    updatedObj["members"] = {};
    updatedObj["members"]["محمد"] = firebase.default.firestore.FieldValue.delete();

    return this.db.doc<any>('groups/' + "nHDpOcrv0XRoa2iLbMgq").set(updatedObj, { merge: true });

  }

}
