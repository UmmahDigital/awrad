import { Injectable } from '@angular/core';
import { Group } from './entities/group';

@Injectable({
  providedIn: 'root'
})
export class LocalDatabaseService {

  groups: object; // groups = active gorups  // [todo]: watch and save() upon change?
  archivedGroups: object; // [todo]: watch and save() upon change?


  constructor() {

    this.groups = JSON.parse(localStorage.getItem("groups")) || {};

    this.archivedGroups = JSON.parse(localStorage.getItem("archivedGroups")) || {};


  }




  private _byDateSorter(a, b) {
    return a.joinTimestamp - b.joinTimestamp;

  }



  private _save() {
    localStorage.setItem("groups", JSON.stringify(this.groups));
    localStorage.setItem("archivedGroups", JSON.stringify(this.archivedGroups));

  }

  // setUsername(groupId, name) {

  //   if (!this.groups[groupId]) {
  //     return;
  //   }

  //   this.groups[groupId].userName = name
  //   this._save();
  // }

  getUsername(groupId) {
    return this.groups[groupId].username;
  }

  joinGroup(groupId, username) {

    this.groups[groupId] = {
      isJoined: true,
      username: username,
      joinTimestamp: Date.now()
    };

    this._save();
  }

  isGroupJoined(groupId) {
    return (this.groups[groupId] != null) && this.groups[groupId].isJoined;
  }

  getGroups() {
    return this.groups;
  }

  // getMyGroupCycle(groupId) {
  //   return this.groups[groupId].cycle;
  // }

  getMyGroups() {
    return Object.keys(this.groups).sort(this._byDateSorter);
  }

  archiveGroup(group: Group) {

    this.archivedGroups[group.id] = {
      id: group.id,
      title: group.title,
      joinTimestamp: this.groups[group.id].joinTimestamp,
      archivedTimeStamp: Date.now()
    }

    delete this.groups[group.id];

    this._save();
  }

  // removeGroup(groupId) {
  //   delete this.archivedGroups[groupId];
  //   this._save();
  // }


  clearArchive() {
    this.archivedGroups = {};
    this._save();
  }




  getArchivedGroups() {
    return Object.values(this.archivedGroups).sort(this._byDateSorter);
  }

  hasArchive() {
    return Object.keys(this.archivedGroups).length > 0
  }





}
