const Group = require('../db/groups')

add = (msg) => {

    Group.findOne({
        'groupId': msg.chat.id
    })
        .then(res => {
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
                group.save();
            }
        })
}

get = async (chatId = undefined) => {
    let condition = chatId ? {
        'groupId': chatId
    } : {};

    return Group.find(condition);
}

setLock = async (msg, state) => {
    return Group.findOneAndUpdate({
        'groupId': msg.chat.id
    }, {
            $set: {
                'lock.status': state,
                'lock.messageId': msg.message_id + 1
            }
        }).exec();
}

getGroupsList = (bot, msg) => {
	btnList_2 = []
    Group.find({}).exec((err, res) => {
        if (err)
            console.log('error', err)
        else {
            let btnList = [];
            res.map(m => {
                return {
                    name: m.name,
                    id: m.groupId
                }
            })
                .filter(m => m.name != undefined)
                .forEach((g,i) =>
			            btnList.push([{
                        text:`${g.name}`,
                        callback_data: JSON.stringify({
                            groupId: g.id,
                            mode: 'g-set'
                        })
                    }])
                    );
					  console.log('List',btnList);
             bot.sendMessage(msg.from.id, 'Select Group:', {
                 "reply_markup": {
                     "inline_keyboard": btnList
                 }
             });
        }
    })
}


module.exports = {
    Add: add,
    Get: get,
    SetLock: setLock,
    GetGroupsList: getGroupsList
}