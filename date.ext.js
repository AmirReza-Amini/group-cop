var moment = require('moment');
moment.locale('fa');

timeStampToDateTime = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

dateToTimeStamp = (date) => {
    var datum = Date.parse(date);
    return datum / 1000;
}

toEnDate = (date) => {
    let enDate = moment.unix(date)
        .subtract(1, 'days')
        .toDate();
    enDate.setUTCHours(20, 30, 0, 0);
    return enDate;
}

oneWeekLater = (date) => {
    let enDate = moment.unix(date)
        .subtract(1,'weeks')
        .toDate();
    enDate.setUTCHours(20, 30, 0, 0);
    return enDate;
}

module.exports = {
    TimeStampToDateTime: timeStampToDateTime,
    DateToTimeStamp: dateToTimeStamp,
    ToEnDate: toEnDate,
    OneWeekLater: oneWeekLater
}