/**
 * 
 * @param {Date} date 
 * @returns 
 */
function getLastDate(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

// 1, 31
// 2, 28
// 3, 31
// 4, 30
// 5, 31


// console.log(today.getDay()); // 요일
/**
 * 
 * @param {Date} date 
 */
function getMonthDays(date) {
    const lastDate = getLastDate(date);
    const days = [];
    for (let index = 1; index <= lastDate; index++) {
        let t = new Date(date.getFullYear(), date.getMonth(), index, 0);
        days.push({
            year: t.getFullYear(),
            month: t.getMonth() + 1,
            date: t.getDate(),
            day: t.getDay()
        });
    }
    return days;
}

function groupingWeek(days, withPadding = false) {
    let weeks = [];
    let week = [];
    let next = false;
    for (const day of days) {
        week.push(day);
        if (day.day == 6) {
            next = true;
        }
        if (next) {
            weeks.push(week);
            week = [];
            next = false;
        }
    }
    let lastgroup = weeks.slice(-1)[0];
    let last = lastgroup.slice(-1)[0];
    if (days.slice(-1)[0].date !== last.date) {
        weeks.push(week);
    }

    if (withPadding) {
        // first week padding
        let firstweek = weeks[0];
        if (firstweek.length < 7) {
            let c = 7 - firstweek.length;
            for (let t = 0; t < c; t++) {
                firstweek.unshift({});
            }
        }

        // last week padding
        let lastweek = weeks[weeks.length - 1];
        if (lastweek.length < 7) {
            let c = 7 - lastweek.length;
            for (let t = 0; t < c; t++) {
                lastweek.push({});
            }
        }
    }

    return weeks;
}

/**
 * 
 * @param {Date[]} days 
 */
function groupingDate(days) {
    const weeks = [];
    let week = [];
    let next = false;
    for (let index = 0; index < days.length; index++) {
        const date = days[index];
        if (next) {
            weeks.push(week);
            week = [];
            next = false;
        }
        if (date.getDay() === 6) {
            next = true;
        }
    }
    if (week.length > 0) {
        weeks.push(week);
    }
    console.log(weeks);
}
// const today = new Date();
// today.setMonth(0);
// console.log(groupingWeek(getMonthDays(today)));
// console.log(getMonthDays(today));

// TODO: calendar class 만들기

function deltaTime(miliseconds) {
    let sec, min, hour, day, year, output = [], suffix = '전';
    function div(a, b) {
        const m = parseInt(a / b), r = a % b;
        return [m, r];
    }

    if (miliseconds < 0) {
        miliseconds *= -1;
        suffix = '후';
    }

    sec = miliseconds / 1000;
    [min, sec] = div(sec, 60);
    [hour, min] = div(min, 60);
    [day, hour] = div(hour, 24);
    [year, day] = div(day, 365);

    if (year) {
        output.push(year + '년');
    }
    if (day) {
        output.push(day + '일');
    }
    if (hour) {
        output.push(hour + '시간');
    }
    if (min) {
        output.push(min + '분');
    }
    if (sec) {
        output.push(sec + '초')
    }
    return output.join(' ') + ' ' + suffix;
}

class Calendar {
    days;
    groupedDays;
    thisYear;
    thisMonth;
    thisDate;
    thisDay;
    constructor() {

    }
}