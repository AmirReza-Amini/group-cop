const express = require('express')
const setting = require('./bot-setting')
const TelegramBot = require('node-telegram-bot-api')
const fn = require('./bot-functions')
const postBl = require('./BL/postBl')
const groupBl = require('./BL/groupBl')
const schedule = require('node-schedule');
const token = setting.botToken
require('./PersianCalendar')

const bot = new TelegramBot(token, {
    polling: true
})

var dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = 23;
dailyRule.minute = 59;

var weeklyRule = new schedule.RecurrenceRule();
weeklyRule.dayOfWeek = 5;
weeklyRule.hour = 9;
weeklyRule.minute = 0;

//var dailyReport = schedule.scheduleJob(dailyRule, async () => {
//    let groups = (await groupBl.Get()).filter(m => m.name != undefined);
//   groups.forEach(g => {
//        postBl.DailyReport(bot, g.groupId, g.groupId)
//    })
//});

var weeklyReport = schedule.scheduleJob(weeklyRule, async () => {
    let groups = (await groupBl.Get()).filter(m => m.name != undefined);
    groups.forEach(g => {
        postBl.WeeklyReport(bot, g.groupId, g.groupId)
    })
});

bot.on('new_chat_members', msg => {

    if (msg.from.last_name == 'بخون') {
        fn.DeleteLastMessage(bot, msg);
        bot.kickChatMember(msg.chat.id, msg.from.id);
    } else {
        if (setting.greetingMessage.active && msg.chat.id != -1001078637897)
            msg.new_chat_members.forEach(member => {
                let user = member.username ?
                    '@' + member.username :
                    (member.first_name + ' ' + (member.last_name ?
                        member.last_name :
                        ''))
                fn.SendTextMessage(bot, msg, user + '\n' + setting.greetingMessage.message)
            })

        if (setting.removeAddMessage)
            fn.DeleteLastMessage(bot, msg)
    }
})


bot.on('left_chat_member', msg => {
    if (setting.removeLeftMessage)
        fn.DeleteLastMessage(bot, msg)
})

bot.on('callback_query', msg => {
    var data = JSON.parse(msg.data);
    let txt = 'Daily report...';
    switch (data.mode) {
        case 'g-set':
            bot.editMessageReplyMarkup({
                "inline_keyboard": [
                    [{
                        text: 'Daily Report',
                        callback_data: JSON.stringify({
                            groupId: data.groupId,
                            mode: 'd-report'
                        })
                    },
                    {
                        text: 'Weekly Report',
                        callback_data: JSON.stringify({
                            groupId: data.groupId,
                            mode: 'w-report'
                        })
                    },

                    ],
                    [{
                        text: 'Back',
                        callback_data: JSON.stringify({
                            groupId: data.groupId,
                            mode: 'back'
                        })
                    }]
                ]
            }, {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id
            })
            break;
        case 'd-report':
            postBl.DailyReport(bot, data.groupId, msg.from.id);
            break;
        case 'w-report':
            postBl.WeeklyReport(bot, data.groupId, msg.from.id);
        case 'back':
            groupBl.GetGroupsList(bot, msg);
            break;
        default:
            break;
    }

    bot.answerCallbackQuery(msg.id, {
        callback_query_id: msg.id,
        text: txt,
        show_alert: false
    });
});



bot.on('message', async msg => {
    groupBl.Add(msg); // Add if not in Db   
    if (msg.from.id != setting.admin && !setting.allowedGroups.includes(msg.chat.id)) {
        fn.SendTextMessage(bot, msg, `شما مجاز به استفاده از ربات نیستید!!!
        جهت کسب اطلاعات بیشتر به آیدی زیر مراجعه نمایید:
        @amirrezaamini 😎`);
        return
    };

    let commands = ['/lock@araMobserbot', '/unlock@araMobserbot', '/dailyreport@araMobserbot']
    if (msg.text == '/add') {
        setting.allowedGroups.push(msg.from.id)
    }
    else if (msg.reply_markup && msg.reply_markup.inline_keyboard[0][0].text != 'Show comments')
        fn.DeleteLastMessage(bot, msg)
    else if (msg.text && new RegExp(setting.forbidenKeys.join("|")).test(msg.text) && new RegExp(setting.forbidenTerms.join("|")).test(msg.text)) {
        fn.DeleteLastMessage(bot, msg)
    }
    else if (msg.caption && new RegExp(setting.forbidenKeys.join("|")).test(msg.caption) && new RegExp(setting.forbidenTerms.join("|")).test(msg.caption)) {
        fn.DeleteLastMessage(bot, msg)
    }
    else if (msg.chat.type == 'private') {
        if (msg.from.id == setting.admin) {
            if (msg.text == '/start')
                fn.SendTextMessage(bot, msg, '/list');

            switch (msg.text) {
                case '/list':
                    groupBl.GetGroupsList(bot, msg);
                    break;
                default:
                    break;
            }
        }
    } else {
        if (!commands.includes(msg.text))
            await postBl.Add(msg);

        var lockData = await groupBl.Get(msg.chat.id)[0];

        if (msg.entities && msg.entities[0].type == 'bot_command') {
            let isAdmin = await fn.IsAdmin(bot, msg);
            if (isAdmin || msg.from.id == setting.admin) {
                let command = msg.text;
                switch (command) {
                    case commands[0]:
                        if (lockData && !lockData.lock.status) {
                            groupBl.SetLock(msg, true);
                            fn.SendTextMessage(bot, msg, 'گروه در حال حاضر قفل می باشد 🔒')
                        }
                        fn.DeleteLastMessage(bot, msg)
                        break;
                    case commands[1]:
                        if (lockData && lockData.lock.status) {
                            groupBl.SetLock(msg, false);
                            fn.DeleteLastMessage(bot, msg, {
                                message_id: lockData.lock.messageId
                            })
                        }
                        fn.DeleteLastMessage(bot, msg)
                        break;
                    case commands[2]:
                        fn.DeleteLastMessage(bot, msg)
                        if (msg.from.id == setting.admin) {
                            postBl.DailyReport(bot, msg.chat.id, msg.chat.id);
                        }
                        break;
                    default:
                        break;
                }
            } else {
                fn.DeleteLastMessage(bot, msg)
            }
        } else if (lockData && lockData.lock.status) {
            if (msg.from.id != setting.admin) {
                fn.DeleteLastMessage(bot, msg, {
                    allowAdmin: true
                })
            }
        } else {
            delete msg.forward_from
            delete msg.forward_date
            let group = (await groupBl.Get()).filter(m => m.groupId == msg.chat.id)[0];
            if (group.deleteFreqMsgs.active)
                fn.DeleteSequentialMessages(bot, msg,
                    group.deleteFreqMsgs.count)

            if (setting.scheduleMessages.active)
                fn.DeleteForwardedMessageInForbiddenTime(bot, msg,
                    setting.scheduleMessages.start,
                    setting.scheduleMessages.end)

            if (setting.scheduleMessages.active) {
                fn.DeleteForwardedMessageInForbiddenTime(bot, msg,
                    setting.scheduleMessages.start,
                    setting.scheduleMessages.end)
            }
            if (!setting.Permissions.sticker)
                fn.DeleteSticker(bot, msg)

            if (!setting.Permissions.forward)
                fn.DeleteForwardedMessage(bot, msg)

            if (!setting.Permissions.badTerms)
                fn.DeleteMessageWithRestrictedTerms(bot, msg)
        }
    }
})


bot.on('polling_error', msg => {
    console.log('ERROR', msg)
})

var app = express()
module.exports = app