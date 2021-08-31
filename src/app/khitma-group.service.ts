import { Injectable } from '@angular/core';
import { KhitmaGroup, NUM_OF_AJZA, KHITMA_CYCLE_TYPE, KhitmaGroup_SameTask } from './entities/entities';

import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError, take, first } from 'rxjs/operators';
import { environment } from '../environments/environment';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ThrowStmt } from '@angular/compiler';
import { LocalDatabaseService } from './local-database.service';


import * as firebase from 'firebase/app';
import 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class KhitmaGroupService {

  private _currentGroup = new Subject();
  private _currentGroupObj: KhitmaGroup = null;

  private groupsDocs: object = {}; // save references of queried groups

  private _isV2Api = true;

  constructor(private db: AngularFirestore, private localDB: LocalDatabaseService,) { }

  public getGroupDetailsOnce(groupId: string): Observable<KhitmaGroup> {
    this.groupsDocs[groupId] = this.db.doc<KhitmaGroup>('groups/' + groupId);
    return this.groupsDocs[groupId].get().pipe(map(res => {
      const data = (<any>res).data();
      const id = (<any>res).id;
      return { id, ...data };
    }));
  }

  public setCurrentGroup(groupId: string) {

    this.groupsDocs[groupId] = this.db.doc<any>('groups/' + groupId); // any should be `KhitmaGroup` after change stabilyzes 

    this.groupsDocs[groupId].valueChanges({ idField: 'id' }).subscribe((group: any) => {

      this._currentGroupObj = group;
      this._currentGroup.next(this._currentGroupObj);

    });

    return this.getGroupDetailsOnce(groupId);

  }

  public getCurrentGroup() {
    return this._currentGroup;
  }

  public getCurrentGroupId() {
    return this._currentGroupObj.id;
  }


  public createGroup(title, description, author, groupType?, firstTask?) {

    let newGroupObj = {
      "title": title,
      "description": description || '',
      "author": author,
      "type": groupType,
      "cycle": 0,

    };

    newGroupObj["task"] = firstTask;
    newGroupObj["members"] = {};
    newGroupObj["members"][author] = {
      // name: author,
      isTaskDone: false
    }

    return this.db.collection('groups').add(newGroupObj);

  }

  public getGroupURL(groupId: string) {
    return location.origin + '/group/' + groupId;
  }

  public isValidGroup(group: KhitmaGroup) {

    return group && group.title ? true : false;
  }


  public updateGroupInfo(groupId, title, description, targetDate, admins) {

    this.db.doc<KhitmaGroup>('groups/' + groupId).update({
      title: title,
      description: description || "",
      targetDate: targetDate || "",
      admins: admins || ""
    });

  }

  // ******** SEQUENTIAL KHITMA


  getGroups(groupsIds: string[]) {
    return this.db.collection('groups', ref => ref.where('__name__', 'in', groupsIds)).valueChanges({ idField: 'id' });
  }


  // ******** SAMETASK KHITMA

  updateGroupTask(groupId, newTask, currentCycle, resetedMembers) {

    this.db.doc<KhitmaGroup_SameTask>('groups/' + groupId).update({ "task": newTask, "members": resetedMembers, "cycle": (currentCycle + 1) });
  }


  addGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj[("members." + memberName)] = {
      // "name": memberName,
      "isTaskDone": false
    };

    return this.db.doc<KhitmaGroup>('groups/' + groupId).update(updatedObj);

  }

  removeGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj["members"] = {};
    updatedObj["members"][memberName] = firebase.default.firestore.FieldValue.delete();

    return this.db.doc<any>('groups/' + groupId).set(updatedObj, { merge: true });


  }

  updateMemberTask(groupId, memberName, isDone: boolean) {

    let updatedObj = {};

    updatedObj["members." + memberName + ".isTaskDone"] = isDone;

    updatedObj["totalDoneTasks"] = firebase.default.firestore.FieldValue.increment(isDone ? 1 : -1);

    this.db.doc<KhitmaGroup>('groups/' + groupId).update(updatedObj);


  }



}
