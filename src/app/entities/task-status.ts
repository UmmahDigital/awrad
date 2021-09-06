export const TASK_STATUS = {
    TODO: 0,
    DOING: 1,
    DONE: 2,
};

export class TaskStatus {
    groupTaskId: string;
    status: number; // TASK_STATUS

    public constructor(init?: Partial<TaskStatus>) {
        Object.assign(this, init);
    }

    public static getNextStatus(status: number) {
        return TASK_STATUS[(status + 1) % Object.keys(TASK_STATUS).length];
    }
}