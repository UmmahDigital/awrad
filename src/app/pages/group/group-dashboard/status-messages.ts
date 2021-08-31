import { GROUP_TYPE } from "src/app/entities/entities";


function _getDateInArabic(date: Date) {
    // var months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
    //   "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    var days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];

    return days[date.getDay()] + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getUTCFullYear();
}


function statusMsg_SameTask(group) {

    function getStatusIcon(isDone) {
        return isDone ? '🟢' : '🔴';
    }

    const NEW_LINE = "\n";
    const now = new Date();

    let msg = group.title;

    msg += NEW_LINE;
    msg += _getDateInArabic(now);
    msg += NEW_LINE;
    msg += NEW_LINE;

    msg += "المهمّة الحاليّة: " + group.task;
    msg += NEW_LINE;
    msg += NEW_LINE;

    group.members.forEach(member => {

        msg += getStatusIcon(member.isTaskDone) + " " + member.name;
        msg += NEW_LINE;

    });

    msg += NEW_LINE;

    if (group.targetDate) {
        msg += "موعد تسليم المهمّة: " + group.targetDate + ".";
        msg += NEW_LINE;
        msg += NEW_LINE;
    }

    msg += "رجاء حتلنة مهمّتكم عن طريق الرابط: " + group.getURL();

    msg += NEW_LINE;
    msg += NEW_LINE;

    msg += "بارك الله بكم!";

    return msg;
}

let _StatusMessages = {};
_StatusMessages[GROUP_TYPE.SAME_TASK] = statusMsg_SameTask;


export const StatusMessageGenerators = _StatusMessages;