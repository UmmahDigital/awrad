import { Injectable } from '@angular/core';

import { forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { LocalDatabaseService } from './local-database.service';


import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Group } from './entities/group';
import { TaskStatus, TASK_STATUS } from './entities/task-status';
import { GroupTask } from './entities/group-task';
import { GroupMember } from './entities/member';
import { toJsonObj } from './entities/helpers';



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

    this.groupsDocs[groupId] = this.db.doc<Group>('groups/' + groupId); // any should be `Group` after change stabilyzes 

    this.groupsDocs[groupId].valueChanges({ idField: 'id' }).subscribe((group: Group) => {

      if (!group.title) {
        return;
      }

      this._currentGroupObj = new Group(group);

      if (this._currentGroupObj.isAdminExcluded) {
        delete this._currentGroupObj.members[this._currentGroupObj.author];

        // this._currentGroupObj.admins.split(",").forEach();
      }

      this._currentGroup.next(this._currentGroupObj);

    });

    return this.getGroupDetailsOnce(groupId);

  }

  public getCurrentGroup() {
    return this._currentGroup;
  }


  public createGroup(title, description, author, tasks: Record<number, GroupTask>, isAdminExcluded) {

    let newGroup = new Group({
      "title": title,
      "description": description || '',
      "author": author,
      "cycle": 0,
      "totalDoneTasks": 0,
      "tasks": tasks, //GroupTask.array2Obj(tasks),
      "members": {},
      "membersTasksStatuses": {},
      "isAdminExcluded": isAdminExcluded
    });

    newGroup["members"][author] = new GroupMember({ name: author });

    return this.db.collection('groups').add({
      ...toJsonObj(newGroup),
      "creationTimestamp": firebase.default.firestore.FieldValue.serverTimestamp()
    });

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

    let groups$ = [];

    groupsIds.forEach(groupId => {
      groups$.push(this.getGroupDetailsOnce(groupId));
    });

    return forkJoin(groups$).pipe(map((_groups: any) => {

      let groups: Group[] = [];

      _groups.forEach(_group => {
        groups.push(new Group(_group));
      });

      return groups;

    }))
  }


  removeGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj["members"] = {};
    updatedObj["members"][memberName] = firebase.default.firestore.FieldValue.delete();
    updatedObj["members"][memberName] = firebase.default.firestore.FieldValue.delete();

    return this.db.doc<any>('groups/' + groupId).set(updatedObj, { merge: true });


  }

  updateMemberTask(groupId: string, memberName: string, taskId: number, newStatus: number) {

    let updatedObj = {};

    // updatedObj["members." + memberName + ".tasksStatuses." + taskId + ".status"] = newStatus;
    updatedObj["membersTasksStatuses." + memberName + "." + taskId + ".status"] = newStatus;

    let countDelta = 0;
    switch (newStatus) {
      case TASK_STATUS.DONE: countDelta = 1; break;
      case TASK_STATUS.DOING: countDelta = 0; break;
      case TASK_STATUS.TODO: countDelta = -1; break;
    }

    updatedObj["totalDoneTasks"] = firebase.default.firestore.FieldValue.increment(countDelta);

    this.db.doc<Group>('groups/' + groupId).update(updatedObj);

  }



  updateGroupTasks(groupId: string, updatedTasks: Record<number, GroupTask>, updatedTasksStatuses: Record<string, Record<number, TaskStatus>>, isNewCycle) {

    let updatedObj = {
      "tasks": toJsonObj(updatedTasks),
      "membersTasksStatuses": toJsonObj(updatedTasksStatuses),
      "cycle": firebase.default.firestore.FieldValue.increment(isNewCycle ? 1 : 0)
    };

    this.db.doc<any>('groups/' + groupId).update(updatedObj);
  }


  addGroupMember(groupId, memberName) {

    let updatedObj = {};
    updatedObj[("members." + memberName)] = {
      name: memberName
    };

    return this.db.doc<Group>('groups/' + groupId).update(updatedObj);

  }



}



