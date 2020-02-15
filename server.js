
const util = require('./tools/util')
const setting = require('./bot-setting');
const http = require('http')

require('./Bot')(setting)
var server = http.createServer();
server.listen(setting.bot.port);
server.on('listening', () => util.Server.OnListen(setting.bot.port));
server.on('error', () => util.Server.onError); 