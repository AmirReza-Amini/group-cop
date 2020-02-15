const moment = require('jalali-moment');

String.prototype.toPersianDatetime = function (date) {
    return toDate(date,'YYYY/MM/DD hh:mm:ss')
};

String.prototype.toPersian = function (date) {
    return toDate(date,'YYYY/MM/DD')
};



String.prototype.toPersianDateString = function (date) {
    return toDateString(date);
};

Number.prototype.toPersianDatetime = function (date) {
    return toDate(date,'YYYY/MM/DD hh:mm:ss')
};

Number.prototype.toPersian = function (date) {
    return toDate(date,'YYYY/MM/DD')
};

Number.prototype.toPersianDateString = function (date) {
   return toDateString(date);
};



function getMonthName(month) {
    let months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return months[month - 1];
}

function getWeekDayName(day) {
    let days = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
    return days[day - 1];
}

function getDayName(day) {
    let days = ['یکم', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفنم','هشتم', 'نهم', 'دهم', 'یازدهم',
        'دوازدهم', 'سیزدهم', 'چهاردهم','پانزدهم', 'شانزدهم', 'هفدهم', 'هجدهم', 'نوزدهم', 'بیستم',
        'بیست و یکم','بیست و دوم', 'بیست و سوم', 'بیست و چهارم', 'بیست و پنجم', 'بیست و ششم',
        'بیست و هفتم', 'بیست و هشتم','بیست و نهم','سی ام','سی و یکم'];

    return days[day - 1];
}

function toDate(date,format) {
    return moment(date).locale('fa').format(format);
}

function toDateString(date) {
    let year = toDate(date, 'YYYY');
    let month = getMonthName(toDate(date, 'MM'));
    let day = getDayName(toDate(date, 'DD'));
    let dayName = getWeekDayName(moment(date).locale('fa').weekday());

    return `${dayName}، ${day} ${month} ماه ${year}`;
}