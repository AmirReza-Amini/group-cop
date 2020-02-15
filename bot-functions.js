const postBl = require('./BL/postBl')

var lastMessages = [{
    id: -1,
    groupId: -1,
    count: 0
}];

let extraAlertSent = false;


deleteSequentialMessages = (bot, msg, count) => {
    let lastMessage = lastMessages.find(m => m.groupId == msg.chat.id);
    if (!lastMessage) {
        lastMessage = { id: msg.from.id, groupId: msg.chat.id, count: 0 };
        lastMessages.push(lastMessage)
        extraAlertSent = false;
    }
    else if (lastMessage.id != msg.from.id) {
        let index = lastMessages.indexOf(m => m.groupId == msg.chat.id);
        lastMessages.splice(index, 1);
        lastMessage = { id: msg.from.id, groupId: msg.chat.id, count: 0 };
        lastMessages.push(lastMessage)
        extraAlertSent = false;
    }
    let user = msg.from.username ?
        '@' + msg.from.username :
        (msg.from.first_name + ' ' + (msg.from.last_name ?
            msg.from.last_name :
            ''));

    let index = lastMessages.indexOf(m => m.groupId == msg.chat.id);
    lastMessages.splice(index, 1);
    lastMessage.count++;
    lastMessages.push(lastMessage);
    if (lastMessage.count > count) {
        deleteLastMessage(bot, msg);
      //  postBl.Delete(msg);
        if (!extraAlertSent) {
            sendTextMessage(bot, msg, `دوست گرامی گرامی جناب آقای/ سرکار خانم ${user}:
حد مجاز ارسال مطلب متوالی توسط یک اکانت، ${count} عدد می باشد.
بدیهی است در صورت رعایت نکردن، تعداد اضافه پاک خواهد شد. 🌷`);
            extraAlertSent = true;
        }
    }
}

deleteForwardedMessageInForbiddenTime = (bot, msg, from, to) => {
    let hour = new Date().getHours;
    if (hour >= from || hour <= to) {
        isFromAdmin(bot, msg).catch(
            deleteForwardedMessage(bot, msg)
        );
    }
}

deleteSticker = (bot, msg) => {
    if (msg.sticker) {
        isFromAdmin(bot, msg).catch(
            deleteLastMessage(bot, msg)
        );
    }
}

deleteForwardedMessage = (bot, msg) => {

    if (msg.forward_from_message_id) {
        console.log('DELETE_FORWARD')
        deleteLastMessage(bot, msg);
    }
}

deleteMessageWithRestrictedTerms = (bot, msg) => {
    let restrictedTerms = ['instagram.com', 'عوضی', 'www.', 'الاغ'];
    if (msg.text) {
        isFromAdmin(bot, msg).catch(() => {
            for (let term of restrictedTerms) {
                if (msg.text.toLowerCase().includes(term)) {
                    deleteLastMessage(bot, msg)
                }
            }
        });
    }
}

sendTextMessage = async (bot, msg, text, chatId = undefined) => {

    console.log('INSIDE BOT')
    let id = chatId ? chatId : (msg.chat ? msg.chat.id : msg.message.chat.id)
    return bot.sendMessage(id, text);
}

deleteLastMessage = async (bot, msg, options = { allowAdmin: false, message_id: undefined }) => {
    console.log('DELETE_LAST_MESSAGE');
    let isNotAdmin = !(await isFromAdmin(bot, msg));
    let m_id = options.message_id ? options.message_id : msg.message_id;
    if (isNotAdmin || !options.allowAdmin) {
        postBl.Delete(msg);
        return bot.deleteMessage(msg.chat.id, m_id)
    }
}

isFromAdmin = async (bot, msg) => {
    return bot.getChatAdministrators(msg.chat.id).then(admins => {
        let ids = [];
        admins.forEach(admin => {
            ids.push(admin.user.id);
        });

        return ids.includes(msg.from.id);
    });
}

module.exports = {
    SendTextMessage: sendTextMessage,
    DeleteLastMessage: deleteLastMessage,
    DeleteSequentialMessages: deleteSequentialMessages,
    DeleteForwardedMessage: deleteForwardedMessage,
    DeleteForwardedMessageInForbiddenTime: deleteForwardedMessageInForbiddenTime,
    DeleteSticker: deleteSticker,
    DeleteMessageWithRestrictedTerms: deleteMessageWithRestrictedTerms,
    IsAdmin: isFromAdmin
};