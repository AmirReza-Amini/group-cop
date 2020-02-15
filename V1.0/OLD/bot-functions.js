var lastMessage = {
    id: 'Unknown',
    count: 0
};

let extraAlertSent = false;


deleteSequentialMessages = (bot, msg, count) => {
    let user = msg.from.username ?
        '@' + msg.from.username :
        (msg.from.first_name + ' ' + (msg.from.last_name ?
            msg.from.last_name :
            ''));

    if (lastMessage.id === msg.from.id) {
        console.log('Sender id: ' + msg.from.id);
        lastMessage.count++;
        if (lastMessage.count > count) {
            deleteLastMessage(bot, msg);
            if (!extraAlertSent) {
                sendTextMessage(bot, msg, `دوست گرامی گرامی جناب آقای/ سرکار خانم ${user}:
حد مجاز ارسال مطلب متوالی توسط یک اکانت، ${count} عدد می باشد.
بدیهی است در صورت رعایت نکردن، تعداد اضافه پاک خواهد شد. 🌷`);
                extraAlertSent = true;
            }
        }
    } else {
        lastMessage.id = msg.from.id;
        lastMessage.count = 1;
        extraAlertSent = false;
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

sendTextMessage = async (bot, msg, text) => {
   return bot.sendMessage(msg.chat.id, text)
}

deleteLastMessage = async (bot, msg, options = {allowAdmin: false,message_id: undefined}) => {
    console.log('DELETE_LAST_MESSAGE');    
    let isNotAdmin = !(await isFromAdmin(bot, msg));
    let m_id = options.message_id ? options.message_id : msg.message_id;
    if (isNotAdmin || !options.allowAdmin) {
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