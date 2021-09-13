
export const NUM_OF_AJZA = 30;
export const NUM_OF_PAGES = 604;

export function GET_JUZ_READ_EXTERNAL_URL(juzIndex: number): string {

    const JUZ_START_PAGE = [
        1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582
    ];

    const PAGE_OFFSET = 2;

    let url = "https://app.quranflash.com/book/Medina1?ar#/reader/chapter/" + (JUZ_START_PAGE[juzIndex] + PAGE_OFFSET);

    return url;
}


export function toJsonObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}





