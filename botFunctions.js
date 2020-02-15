deleteLastMessage = (bot, msg) => {
    let id = msg.chat ? msg.chat.id : msg.from.id;
    let messageId = msg.message ? msg.message.message_id : msg.message_id;
    bot.deleteMessage(id, messageId)
        .then(() => console.log('Deleted'));

};

sendTextMessage = (bot, msg, text) => {
    try {
        bot.sendMessage(msg.from.id, text)
    } catch (ex) {
        console.log('Sending failed --- ' + msg.from.first_name + '---' + ex)
    }
};

sendCaption = (bot, msg, fileId) => {

    bot.editMessageReplyMarkup({
        "inline_keyboard": [
            [{
                text: '❌ Cancel',
                callback_data: JSON.stringify({
                    fileId: fileId,
                    command: 'c_e'
                })
            }]
        ]
    }, {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id
        })
}

sendConfirm = (bot, msg, fileId) => {
    bot.editMessageReplyMarkup({
        "inline_keyboard": [
            [{
                text: '✅ YES',
                callback_data: JSON.stringify({
                    fileId: fileId,
                    command: 'd_file'
                })
            },
            {
                text: '❌ NO',
                callback_data: JSON.stringify({
                    fileId: fileId,
                    command: 'c_d'
                })
            }
            ]
        ]
    }, {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id
        })
}

cancelConfirm = (bot, msg, fileId) => {
    {
        bot.editMessageReplyMarkup({
            "inline_keyboard": [
                [{
                    text: '❌',
                    callback_data: JSON.stringify({
                        fileId: fileId,
                        command: 'delete'
                    })
                }, {
                    text: '✏️',
                    callback_data: JSON.stringify({
                        fileId: fileId,
                        command: 'edit'
                    })
                }]
            ]
        }, {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id
            })

    }
}

editMessageCaption = (bot, msg, newCaption) => {
    bot.editMessageCaption(newCaption, {
        chat_id: msg.message.chat.id,
        message_id: msg.message.message_id
    })
}

getMe = (bot, msg) => {
    bot.sendMessage(msg.from.id, 'Your info:\n```' + JSON.stringify(msg.from) + '```',
        { parse_mode: 'Markdown' });
}

module.exports = {
    DeleteLastMessage: deleteLastMessage,
    SendText: sendTextMessage,
    SendConfirm: sendConfirm,
    SendCaption: sendCaption,
    CancelConfirm: cancelConfirm,
    EditCaption: editMessageCaption,
    GetMe: getMe
};