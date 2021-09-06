import { GroupTask } from "./group-task";
import { GroupMember } from "./member";
import { TaskStatus, TASK_STATUS } from "./task-status";

export class Group {
    id?: string;
    title?: string;
    description?: string;
    author?: string;
    creationTimestamp?: Date;
    cycle?: number;
    targetDate?: string;
    admins?: string;
    totalDoneTasks: number;

    private _tasks: Record<string, GroupTask>;
    private _members: Record<string, GroupMember>;
    private _lastGeneratedTaskId: number;

    public constructor(init: Partial<Group>, membersTasksStatuses: Record<string, TaskStatus[]>) {
        Object.assign(this, init);
        this.cycle = init.cycle || 0;

        // this.members = this._createMembersArray(this.members);//Object.values(init.members).sort((m1, m2) => (m1.name > m2.name ? 1 : -1));

        this._initMemberTasksStatuses(membersTasksStatuses);
    }

    private _initMemberTasksStatuses(membersTasksStatuses: Record<string, TaskStatus[]>) {

        this.getMembers().forEach(member => {

            let tasksStatuses = membersTasksStatuses[member.name];

            tasksStatuses.forEach(taskStatus => {
                member.setTaskStatus(taskStatus.groupTaskId, taskStatus.status);
            });

            // let tasksStatuses = member.getTasksStatuses();

            // Object.values(tasksStatuses).forEach(taskStatus => {

            //     member.setTaskStatus(taskStatus.groupTaskId, taskStatus.status);

            // });

        });
    }

    public getURL() {
        return location.origin + '/group/' + this.id;
    }

    public isAdmin(username) {
        return username == this.author || this.admins?.includes(username);
    }

    public getProgress() {

        let members = this.getMembers();
        // let tasks = 

        let counters = {};
        counters[TASK_STATUS.DOING] = 0;
        counters[TASK_STATUS.DONE] = 0;

        members.forEach(member => {
            Object.values(member.getTasksStatuses()).forEach(taskStatus => {
                counters[taskStatus.status]++;
            });
        });

        const total = this.getTasks().length * members.length;
        counters[TASK_STATUS.TODO] = total - counters[TASK_STATUS.DOING] - counters[TASK_STATUS.DONE];

        return counters;
    }


    //*********************** */


    public getMembers(): GroupMember[] {
        return Object.values(this._members);
    }

    public getMember(name): GroupMember {
        return this._members[name];
    }

    public getTasks(): GroupTask[] {
        return Object.values(this._tasks);
    }

    public updateTasks(newTasks: Record<string, GroupTask>) {

        this.getMembers().forEach(member => {

            let tasksStatuses = Object.values(member.getTasksStatuses());

            tasksStatuses.forEach(taskStatus => {
                if (!newTasks[taskStatus.groupTaskId]) {
                    member.removeTaskStatus(taskStatus.groupTaskId);
                }
            });
        });

        Object.values(newTasks).forEach(newTask => {
            if (!newTask.id) {
                newTask.id = this._getNewTaskId().toString();
            }
        });

        this._tasks = newTasks;
    }

    private _getNewTaskId() {
        this._lastGeneratedTaskId++;
        return this._lastGeneratedTaskId;
    }



    //*********************** */

    public static updateGroup(group: Group, fieldsToUpdate: Partial<Group>) {
        return { ...group, ...fieldsToUpdate };
    }

    static refineUsername(name) {
        return name.trim();
    }





    // private _createMembersArray(membersObj) {

    //     let arr = [];

    //     for (let [name, value] of Object.entries(membersObj)) {
    //         arr.push({
    //             name: name,
    //             isTaskDone: (<GroupMember>value).isTaskDone
    //         });
    //     }

    //     return arr.sort((m1, m2) => (m1.name > m2.name ? 1 : -1));
    // }

    // public createGroupMember(username) {

    //     let isDone = this.getMembers().find(m => m. === username)?.isTaskDone;

    //     return new GroupMember({
    //         name: username,
    //         isTaskDone: isDone
    //     });
    // }

    // public resetMembersTaskStatus() {
    //     this.members.forEach((member) => {
    //         member.isTaskDone = false;
    //     })
    // }

    // public getMembersObj() {

    //     return this.members.reduce((m, { name, isTaskDone }) => ({
    //         ...m, [name]: {
    //             // name: name,
    //             isTaskDone: isTaskDone
    //         }
    //     }), {});

    // }
}

