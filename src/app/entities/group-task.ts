export class GroupTask {

    public static ID_NOT_SET = -1;

    id: string
    title: string;

    public constructor(init?: Partial<GroupTask>) {
        Object.assign(this, init);
    }
}
