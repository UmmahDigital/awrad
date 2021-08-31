
export const NUM_OF_AJZA = 30;
export const NUM_OF_PAGES = 604;



export const KHITMA_CYCLE_TYPE = Object.freeze({
    AUTO_BOOK: 1,
    ALL_IDLE: 2,

});


export const KHITMA_GROUP_TYPE = Object.freeze({
    SAME_TASK: 'SAME_TASK',
});




export function GET_JUZ_READ_EXTERNAL_URL(juzIndex: number): string {

    const JUZ_START_PAGE = [
        1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582
    ];

    const PAGE_OFFSET = 2;

    let url = "https://app.quranflash.com/book/Medina1?ar#/reader/chapter/" + (JUZ_START_PAGE[juzIndex] + PAGE_OFFSET);

    return url;
}



export class KhitmaGroup {
    id?: string;
    title?: string;
    description?: string;
    author?: string;
    creationDate?: Date;
    cycle?: number;
    targetDate?: string;
    admins?: string;
    type?: string;

    public constructor(init?: Partial<KhitmaGroup>) {
        Object.assign(this, init);
        this.cycle = init.cycle || 0;
    }

    public getURL() {
        return location.origin + '/group/' + this.id;
    }

    public isAdmin(username) {
        return username == this.author || this.admins?.includes(username);
    }

    static refineOwnerName(name) {
        return name.trim();
    }

}



export class KhitmaGroup_SameTask extends KhitmaGroup {
    task: string;
    members: GroupMember[];
    totalDoneTasks: number;

    public constructor(init?: Partial<KhitmaGroup_SameTask>) {
        super(init);
        this.members = this._createMembersArray(this.members);//Object.values(init.members).sort((m1, m2) => (m1.name > m2.name ? 1 : -1));

    }

    private _createMembersArray(membersObj) {

        let arr = [];

        for (let [name, value] of Object.entries(membersObj)) {
            arr.push({
                name: name,
                isTaskDone: (<GroupMember>value).isTaskDone
            });
        }

        return arr.sort((m1, m2) => (m1.name > m2.name ? 1 : -1));
    }

    public getCounts() {

        return {
            total: this.members.length,
            done: this.members.filter(function (item) { return item.isTaskDone; }).length
        };

    }

    public createGroupMember(username) {

        let isDone = this.members.find(m => m.name === username)?.isTaskDone;

        return new GroupMember({
            name: username,
            isTaskDone: isDone
        });
    }

    public resetMembersTaskStatus() {
        this.members.forEach((member) => {
            member.isTaskDone = false;
        })
    }

    public getMembersObj() {

        return this.members.reduce((m, { name, isTaskDone }) => ({
            ...m, [name]: {
                // name: name,
                isTaskDone: isTaskDone
            }
        }), {});

    }
}

export class GroupMember {
    name: string
    isTaskDone: boolean;
    task: string; // default is group task

    public constructor(init?: Partial<GroupMember>) {
        Object.assign(this, init);
    }
}
