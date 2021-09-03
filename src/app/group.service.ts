import { Injectable } from '@angular/core';
import { Group, Group_SameTask } from './entities/entities';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { LocalDatabaseService } from './local-database.service';


import * as firebase from 'firebase/app';
import 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private _currentGroup = new Subject();
  private _currentGroupObj: Group = null;

  private groupsDocs: object = {}; // save references of queried groups


  constructor(private db: AngularFirestore, private localDB: LocalDatabaseService,) { }

  public getGroupDetailsOnce(groupId: string): Observable<Group> {
    this.groupsDocs[groupId] = this.db.doc<Group>('groups/' + groupId);
    return this.groupsDocs[groupId].get().pipe(map(res => {
      const data = (<any>res).data();
      const id = (<any>res).id;
      return { id, ...data };
    }));
  }

  public setCurrentGroup(groupId: string) {

    this.groupsDocs[groupId] = this.db.doc<any>('groups/' + groupId); // any should be `Group` after change stabilyzes 

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

    newGroupObj["task"] = firstTask || null;
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

  public isValidGroup(group: Group) {

    return group && group.title ? true : false;
  }


  public updateGroupInfo(groupId, title, description, targetDate, admins) {

    this.db.doc<Group>('groups/' + groupId).update({
      title: title,
      description: description || "",
      targetDate: targetDate || "",
      admins: admins || ""
    });

  }


  getGroups(groupsIds: string[]) {
    return this.db.collection('groups', ref => ref.where('__name__', 'in', groupsIds)).valueChanges({ idField: 'id' });
  }


  updateGroupTask(groupId, newTask, currentCycle, resetedMembers) {

    this.db.doc<Group_SameTask>('groups/' + groupId).update({ "task": newTask, "members": resetedMembers, "cycle": (currentCycle + 1) });
  }


  addGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj[("members." + memberName)] = {
      // "name": memberName,
      "isTaskDone": false
    };

    return this.db.doc<Group>('groups/' + groupId).update(updatedObj);

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

    this.db.doc<Group>('groups/' + groupId).update(updatedObj);


  }



}
