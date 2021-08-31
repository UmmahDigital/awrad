import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AlertService } from "./alert.service";
import { GroupService } from "./group.service";
import { LocalDatabaseService } from "./local-database.service";

@Injectable()
export class GroupJoinedGuard implements CanActivate {
    constructor(
        private localDB: LocalDatabaseService, private router: Router, private groupsApi: GroupService, private alert: AlertService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const groupId = route.params.groupId;
        const isJoind = this.localDB.isGroupJoined(groupId);

        this.groupsApi.setCurrentGroup(groupId).subscribe((group) => {

            if (!this.groupsApi.isValidGroup(group)) {
                this.alert.show("لم يتم العثور على المجموعة المطلوبة.");
                this.router.navigate(['/']);
                return;
            }
        });

        const redirecTo = isJoind ? 'dashboard' : 'join';
        if (!state.url.includes(redirecTo)) {
            this.router.navigate(['group', groupId, redirecTo]);
        }

        return true;


    }
}