export class GroupTask {

    public static ID_NOT_SET = -1;

    id: number
    title: string;

    public constructor(init?: Partial<GroupTask>) {
        Object.assign(this, init);
    }


    public static array2Obj(tasks: GroupTask[]) {
        return Object.assign({}, ...tasks.map((x) => ({ [x.id]: x })));
    }

    public static textToGroupTaskList(text: string): Record<number, GroupTask> {

        let tasks: Record<number, GroupTask> = {};
        let lines = text.split(/\r?\n/);

        lines.forEach((line, index) => {

            line = line.trim();

            if (line) {
                tasks[index] = new GroupTask({
                    id: index,
                    title: line
                });
            }

        });

        return tasks;
    }

    public toString = (): string => {
        return this.title;
    }
}
