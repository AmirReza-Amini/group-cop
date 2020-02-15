process.env["NTBA_FIX_319"] = 1;
const fn = require('./botFunctions');
const TelegramBot = require('node-telegram-bot-api');
const { toPersian, timeConverter } = require('./tools/util')

module.exports = (setting) => {
    const bot = new TelegramBot(setting.bot.tokens.botName, {
        polling: true
    });

    bot.onText(/test/, msg => {
        //DO_SOMTHING
    });

    bot.on('callback_query', msg => {
        var data = JSON.parse(msg.data);

        switch (data.command) {
            case 'X':
                //DO_SOMTHING
                break;
            case 'Y':
                //DO_SOMTHING
                break;
            default:
                break;
        }

        bot.answerCallbackQuery(msg.id, {
            callback_query_id: msg.id,
            show_alert: false
        });
    });

    bot.on('polling_error', (error) => {
        console.log('ERROR', error);
    });

    bot.onText(/\/start/, msg => {
        fn.SendText(bot, msg, `
🌹Hello ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}
🗓 ${toPersian(timeConverter(msg.date))}`)
    });

    bot.on('message', async msg => {
        //DO_SOMTHING
    });
}