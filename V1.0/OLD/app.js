const express = require('express');
const setting = require('./bot-setting');
const TelegramBot = require('node-telegram-bot-api');
const fn = require('./bot-functions');
const token = setting.botToken;
require('./PersianCalendar');

const bot = new TelegramBot(token, {
    polling: true
});

var LOCK_CHAT = [{
    chatId: undefined,
    status: false,
    messageId: undefined
}]

bot.on('new_chat_members', msg => {
    console.log('NEW_MEMBER')
    if (setting.greetingMessage.active)
        msg.new_chat_members.forEach(member => {
            let user = member.username ?
                '@' + member.username :
                (member.first_name + ' ' + (member.last_name ?
                    member.last_name :
                    ''));
            fn.SendTextMessage(bot, msg, user + '\n' + setting.greetingMessage.message + `

امروز:  ${new Date().toISOString().toPersian()}`);
        });

    if (setting.removeAddMessage)
        fn.DeleteLastMessage(bot, msg);
});

bot.on('left_chat_member', msg => {
    if (setting.removeLeftMessage)
        fn.DeleteLastMessage(bot, msg);
});

bot.on('message', msg => {
    var isLock = LOCK_CHAT.find(m => m.chatId == msg.chat.id);
    if (msg.entities && msg.entities[0].type == 'bot_command') {

        fn.IsAdmin(bot, msg).then(() => {
            let command = msg.text.split('@')[0];
            switch (command) {
                case '/lock':

                    if (!isLock) {
                        LOCK_CHAT.push({
                            chatId: msg.chat.id,
                            messageId: msg.message_id + 1,
                            status: true
                        });
                        fn.DeleteLastMessage(bot, msg);
                        fn.SendTextMessage(bot, msg, 'گروه در حال حاضر قفل می باشد 🔒');
                    }
                    break;
                case '/unlock':
                    if (isLock) {
                        LOCK_CHAT.pop(isLock);
                        fn.DeleteLastMessage(bot, msg, {
                            message_id: isLock.messageId
                        });
                    }
                    fn.DeleteLastMessage(bot, msg);
                    break;
                case '/dailyreport':
                    break;
                default:
                    break;
            }
        });
    } else if (isLock) {
        if (msg.from.id != setting.admin) {
            fn.DeleteLastMessage(bot, msg, {
                allowAdmin: true
            });
        }
    } else {
        delete msg.forward_from;
        delete msg.forward_date;


        if (setting.deleteSequentialMessages.active)
            fn.DeleteSequentialMessages(bot, msg,
                setting.deleteSequentialMessages.count);

        if (setting.scheduleMessages.active)
            fn.DeleteForwardedMessageInForbiddenTime(bot, msg,
                setting.scheduleMessages.start,
                setting.scheduleMessages.end);

        if (setting.scheduleMessages.active) {
            fn.DeleteForwardedMessageInForbiddenTime(bot, msg,
                setting.scheduleMessages.start,
                setting.scheduleMessages.end);
        }
        if (!setting.Permissions.sticker)
            fn.DeleteSticker(bot, msg);

        if (!setting.Permissions.forward)
            fn.DeleteForwardedMessage(bot, msg);

        if (!setting.Permissions.badTerms)
            fn.DeleteMessageWithRestrictedTerms(bot, msg);
    }
});

bot.on('polling_error', msg => {
    console.log('ERROR', msg)
})

var app = express();
module.exports = app;