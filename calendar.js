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
        // days.push(t);
    }
    return days;
}


function calenderDays(gdays) {
    const firstWeek = gdays[0];
    const firstWeekCnt = 7 - firstWeek.length;
    for (let index = 0; index < firstWeekCnt; index++) {
        firstWeek.unshift(null);
    }
    const lastWeek = gdays[gdays.length - 1];
    const lastWeekCnt = 7 - lastWeek.length;
    for (let index = 0; index < lastWeekCnt; index++) {
        lastWeek.push(null);
    }
    return gdays;
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
    return weeks;
}



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

console.log(getMonthDays(new Date()));