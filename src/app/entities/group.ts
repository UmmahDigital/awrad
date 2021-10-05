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
    isAdminExcluded: boolean;

    tasks: Record<number, GroupTask>;
    members: Record<string, GroupMember>;
    membersTasksStatuses: Record<string, Record<number, TaskStatus>>;

    public membersCount = 0;

    public constructor(init: Partial<Group>) {
        Object.assign(this, init);
        this.cycle = init.cycle || 0;
        // this.members = this._createMembersArray(this.members);//Object.values(init.members).sort((m1, m2) => (m1.name > m2.name ? 1 : -1));

        this._initMembersAndTasksStatuses();
        this._initTasks();

    }

    private _initMembersAndTasksStatuses() {

        let tasks = this.getTasks();
        let count = 0;

        Object.keys(this.members).forEach((memberName) => {

            if (this.isAdminExcluded && memberName == this.author) {
                return;
            }

            this.members[memberName] = new GroupMember({ name: memberName });
            this.members[memberName].setTasksStatuses(this.membersTasksStatuses[memberName] || {}, tasks);
            count++;
        });

        this.membersCount = count;

    }

    private _initTasks() {
        Object.keys(this.tasks).forEach((taskId) => {
            this.tasks[taskId] = new GroupTask(this.tasks[taskId]);
        });
    }

    // private _initMemberTasksStatuses(membersTasksStatuses: Record<string, TaskStatus[]>) {

    //     this.getMembers().forEach(member => {

    //         let tasksStatuses = membersTasksStatuses[member.name];

    //         tasksStatuses.forEach(taskStatus => {
    //             member.setTaskStatus(taskStatus.groupTaskId, taskStatus.status);
    //         });

    //         // let tasksStatuses = member.getTasksStatuses();

    //         // Object.values(tasksStatuses).forEach(taskStatus => {

    //         //     member.setTaskStatus(taskStatus.groupTaskId, taskStatus.status);

    //         // });

    //     });
    // }

    public getURL() {
        return location.origin + '/group/' + this.id;
    }

    public isAdmin(username) {
        return username == this.author || this.admins?.includes(username);
    }

    public getProgress() {

        let counters = {};
        counters[TASK_STATUS.DOING] = 0;
        counters[TASK_STATUS.DONE] = 0;

        Object.values(this.membersTasksStatuses).forEach(_memberTasksStatuses => {
            Object.values(_memberTasksStatuses).forEach(taskStatus => {
                counters[taskStatus.status]++;
            });
        });

        counters['total'] = this.getTasks().length * this.getMembers().length;
        counters[TASK_STATUS.TODO] = counters['total'] - counters[TASK_STATUS.DOING] - counters[TASK_STATUS.DONE];

        return counters;
    }


    //*********************** */




    public getMember(name): GroupMember {
        return this.members[name];
    }

    public getMembers(): GroupMember[] {
        return Object.values(this.members).sort((a, b) => { return a.name.localeCompare(b.name); }); // Alphabetical Sort
    }

    public getTasks(): GroupTask[] {
        return Object.values(this.tasks);//.sort((a, b) => { return a.title.localeCompare(b.title); });
    }

    public getTasksString(): string {
        return this.getTasks().join('\r\n');
    }

    public getTask(id): GroupTask {
        return this.tasks[id];
    }

    // public updateTasks(newTasks: Record<string, GroupTask>) {

    //     this.getMembers().forEach(member => {

    //         let tasksStatuses = Object.values(member.getTasksStatuses());

    //         tasksStatuses.forEach(taskStatus => {
    //             if (!newTasks[taskStatus.groupTaskId]) {
    //                 member.removeTaskStatus(taskStatus.groupTaskId);
    //             }
    //         });
    //     });

    //     Object.values(newTasks).forEach(newTask => {
    //         if (!newTask.id) {
    //             newTask.id = this._getNewTaskId();
    //         }
    //     });

    //     this.tasks = newTasks;
    // }

    // private _getNewTaskId() {
    //     this.lastGeneratedTaskId++;
    //     return this.lastGeneratedTaskId;
    // }

    public getProgressMatrix(): number[][] { // rows are members

        function _initMatrix(matrix: number[][], rowCount, columnCount) {

            matrix = [];

            for (let i = 0; i < rowCount; i++) {
                matrix[i] = [];

                for (let j = 0; j < columnCount; j++) {
                    matrix[i][j] = 0;
                }
            }
        }


        let members = this.getMembers();
        let tasks = this.getTasks();

        let progress: number[][] = [];
        _initMatrix(progress, members.length, tasks.length);


        for (let i = 0; i < members.length; i++) {
            progress[i] = [];

            for (let j = 0; j < tasks.length; j++) {
                progress[i][j] = members[i].getTaskStatus(tasks[j].id);
            }
        }

        return progress;

    }



    //*********************** */

    public static updateGroup(group: Group, fieldsToUpdate: Partial<Group>) {
        return { ...group, ...fieldsToUpdate };
    }

    public static refineUsername(name) {
        return name.trim();
    }


    // public static generateMembersTasksStatuses(members: Record<string, GroupMember>, tasksStatuses: Record<string, TaskStatus[]>) {

    //     this.getMembers().forEach(member => {

    //         let tasksStatuses = Object.values(member.getTasksStatuses());

    //         tasksStatuses.forEach(taskStatus => {
    //             if (!newTasks[taskStatus.groupTaskId]) {
    //                 member.removeTaskStatus(taskStatus.groupTaskId);
    //             }
    //         });
    //     });
    // }




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

