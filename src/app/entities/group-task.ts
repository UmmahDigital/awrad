export class GroupTask {
    id: string
    title: string;

    public constructor(init?: Partial<GroupTask>) {
        Object.assign(this, init);
    }
}
