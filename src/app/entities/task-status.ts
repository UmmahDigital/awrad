export const TASK_STATUS = {
    TODO: 0,
    DOING: 1,
    DONE: 2,
};

export class TaskStatus {
    groupTaskId: number;
    status: number; // TASK_STATUS

    public constructor(init?: Partial<TaskStatus>) {
        Object.assign(this, init);
    }

    public static getNextStatus(status: number) {

        if (typeof status != 'number') {
            status = TASK_STATUS.TODO;
        }

        return (status + 1) % Object.keys(TASK_STATUS).length;
    }
}