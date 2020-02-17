const Group = require('../db/groups')

add = async (msg) => {

    let res = await Group.findOne({
        'groupId': msg.chat.id
    })
    if (!res) {
        let group = Group();
        group.groupId = msg.chat.id;
        group.name = msg.chat.title;
        group.lock = {
            status: false,
            messageId: (msg.message_id) + 1
        };
        group.deleteFreqMsgs = {
            active: false,
            count: 0
        }
        try {
            group.save();
        }
        catch (ex) {
            console.log("group-add -> ex", ex)
        }
    }
}

get = async (chatId = undefined) => {
    let condition = chatId ? {
        'groupId': chatId
    } : {};

    return await Group.find(condition);
}

setLock = async (msg, state) => {
    return await Group.findOneAndUpdate({
        'groupId': msg.chat.id
    }, {
        $set: {
            'lock.status': state,
            'lock.messageId': msg.message_id + 1
        }
    });
}

getGroupsList = async (bot, msg) => {
    btnList_2 = []
    let res = await Group.find();
    let btnList = [];
    res.map(m => {
        return {
            name: m.name,
            id: m.groupId
        }
    })
        .filter(m => m.name != undefined)
        .forEach(g =>
            btnList.push([{
                text: `${g.name}`,
                callback_data: JSON.stringify({
                    groupId: g.id,
                    mode: 'g-set'
                })
            }])
        );
    bot.sendMessage(msg.from.id, 'Select Group:', {
        "reply_markup": {
            "inline_keyboard": btnList
        }
    });
}


module.exports = {
    Add: add,
    Get: get,
    SetLock: setLock,
    GetGroupsList: getGroupsList
}