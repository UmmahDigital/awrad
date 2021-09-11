import { TaskStatus, TASK_STATUS } from "./task-status";

export class GroupMember {
    public name: string
    private _tasksStatuses: Record<string, TaskStatus>; // only for "DOING", "DONE" tasks.

    public constructor(init?: Partial<GroupMember>) {
        Object.assign(this, init);
    }

    public getTaskStatus(taskId) {
        return this._tasksStatuses[taskId]?.status || TASK_STATUS.TODO;
    }

    public setTaskStatus(taskId, newStatus) {

        if (!this._tasksStatuses[taskId]) {
            this._tasksStatuses[taskId] = new TaskStatus({
                groupTaskId: taskId,
                status: newStatus
            });

            return;
        }

        this._tasksStatuses[taskId].status = newStatus;
    }

    public setTasksStatuses(tasksStatuses: Record<string, TaskStatus>) {
        this._tasksStatuses = tasksStatuses;
    }

    public getTasksStatuses() {
        return this._tasksStatuses;
    }

    public removeTaskStatus(taskId) {
        delete this._tasksStatuses[taskId];
    }

    public getProgress() {

        let counters = {};
        counters[TASK_STATUS.DOING] = 0;
        counters[TASK_STATUS.DONE] = 0;

        Object.values(this._tasksStatuses).forEach(taskStatus => {
            counters[taskStatus.status]++;
        });

        // counters[TASK_STATUS.TODO] = counters['total'] - counters[TASK_STATUS.DOING] - counters[TASK_STATUS.DONE];

        return counters;

    }


}




