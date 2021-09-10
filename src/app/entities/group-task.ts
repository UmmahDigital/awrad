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
}
