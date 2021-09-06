import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { LocalDatabaseService } from './local-database.service';


import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Group } from './entities/group';
import { TaskStatus, TASK_STATUS } from './entities/task-status';
import { GroupTask } from './entities/group-task';



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


  public createGroup(title, description, author) {

    let newGroupObj = {
      "title": title,
      "description": description || '',
      "author": author,
      "cycle": 0,
    };

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


  removeGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj["members"] = {};
    updatedObj["members"][memberName] = firebase.default.firestore.FieldValue.delete();

    return this.db.doc<any>('groups/' + groupId).set(updatedObj, { merge: true });


  }

  updateMemberTask(groupId: string, memberName: string, taskId: string, newStatus: number) {

    let updatedObj = {};

    updatedObj["members." + memberName + ".tasksStatuses." + taskId + ".status"] = newStatus;

    let countDelta = 0;
    switch (newStatus) {
      case TASK_STATUS.DONE: countDelta = 1; break;
      case TASK_STATUS.DOING: countDelta = 0; break;
      case TASK_STATUS.TODO: countDelta = -1; break;
    }

    updatedObj["totalDoneTasks"] = firebase.default.firestore.FieldValue.increment(countDelta);

    this.db.doc<Group>('groups/' + groupId).update(updatedObj);

  }



  updateGroupTasks(groupId: string, updatedTasks: Record<string, GroupTask>, updatedTasksStatuses: Record<string, TaskStatus>, isNewCycle) {

    let updatedObj = {
      "task": updatedTasks,
      "tasksStatuses": updatedTasksStatuses,
      "cycle": firebase.default.firestore.FieldValue.increment(isNewCycle ? 1 : 0)
    };

    this.db.doc<any>('groups/' + groupId).update(updatedObj);
  }


  addGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj[("members." + memberName)] = {
      // "name": memberName,
      "isTaskDone": false
    };

    return this.db.doc<Group>('groups/' + groupId).update(updatedObj);

  }



}



