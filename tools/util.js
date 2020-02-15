const moment = require('jalali-moment')
const setting = require('../bot-setting');

timeConverter = (UNIX_timestamp) => {
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

toPersian = (date) => {
  return moment(date, 'YYYY-M-D HH:mm:ss')
    .locale('fa')
    .format('YYYY/M/D HH:mm'); // 1392/6/31 23:59:59
}

String.prototype.toPersian = toPersian;


onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

onListen = (port) => {
  console.log(`${setting.name} is listening to port ${port}`)
}

RedisResponse = (res) => {
  try {
    return JSON.parse(res)
  }
  catch{
    return res;
  }
}

RedisRequest = (req) => {
  return WhatIsIt(req) == 'Object' ? JSON.stringify(req) : req
}

WhatIsIt = (object) => {
  var stringConstructor = "ara".constructor;
  var arrayConstructor = [].constructor;
  var objectConstructor = ({}).constructor;
  if (object === null) return "null";
  if (object === undefined) return "undefined";
  if (object.constructor === stringConstructor) return "String";
  if (object.constructor === arrayConstructor) return "Array";
  if (object.constructor === objectConstructor) return "Object";
  return "don't know";
}


module.exports = {
  Server: {
    OnError: onError,
    OnListen: onListen
  },
  Redis: {
    Get: RedisResponse,
    Set: RedisRequest
  },
  Date: {
    timeStampToStandard: timeConverter,
    toPersian: toPersian
  }
}