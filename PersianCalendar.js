const moment = require('moment');
moment.locale('fa');

_toPersianDatetime = (date) => {
    let _date = Date.parse(date);
    return toDate(_date, 'YYYY/MM/DD hh:mm:ss')
};

_toPersiantime = (date) => {
    let _date = Date.parse(date);
    return toDate(_date, 'HH:mm')
};

_toPersian = (date) => {
    let _date = Date.parse(date);
    return toDate(_date.toISODateString(), 'YYYY/MM/DD')
};

_toPersianDateString = (date) => {
    let _date = Date.parse(date);
    return toDateString(_date.toISODateString());
};

String.prototype.toPersianDatetime = _toPersianDatetime;
String.prototype.toPersian = _toPersian;
String.prototype.toPersianDateString = _toPersianDateString;

Number.prototype.toPersianDatetime = _toPersianDatetime;
Number.prototype.toPersian = _toPersian;
Number.prototype.toPersianDateString = _toPersianDateString;

function getMonthName(month) {
    let months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    return months[month - 1];
}

function getWeekDayName(day) {
    let days = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
    return days[day - 1];
}

function getDayName(day) {
    let days = ['یکم', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفنم', 'هشتم', 'نهم', 'دهم', 'یازدهم',
        'دوازدهم', 'سیزدهم', 'چهاردهم', 'پانزدهم', 'شانزدهم', 'هفدهم', 'هجدهم', 'نوزدهم', 'بیستم',
        'بیست و یکم', 'بیست و دوم', 'بیست و سوم', 'بیست و چهارم', 'بیست و پنجم', 'بیست و ششم',
        'بیست و هفتم', 'بیست و هشتم', 'بیست و نهم', 'سی ام', 'سی و یکم'
    ];

    return days[day - 1];
}

function toDate(date, format) {
    return moment(date)
        .subtract(30, 'minutes')
        .add(12, 'hours')
        .format(format);
}



function toDateString(date) {
    let year = toDate(date, 'YYYY');
    let month = getMonthName(toDate(date, 'MM'));
    let day = getDayName(toDate(date, 'DD'));
    let dayName = getWeekDayName(moment(date).weekday());

    return `${dayName}، ${day} ${month} ماه ${year}`;
}

module.exports = {
    ToPersianDateTime: _toPersianDatetime,
    ToPersianTime: _toPersiantime,
    ToPerisan: _toPersian,
    ToPersianDateString: _toPersianDateString,

}