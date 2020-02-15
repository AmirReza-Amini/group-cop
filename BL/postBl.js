const Post = require('../db/posts')
const fn = require('../bot-functions')
const timeTools = require('../date.ext');
const pc = require('../PersianCalendar')

add = (msg) => {
    let post = Post();
    post.message = msg;
    post.save();
}

deletePost = (msg) => {
    Post.deleteOne({
        'message.chat.id': msg.chat.id,
        'message.message_id': msg.message_id
    }).exec((err, res) => { if (!err) console.log('Deleted from db') })
}

dailyReport = (bot, groupId, chatId) => {
    console.log(new Date().toLocaleString())
    let endDate = timeTools.ToEnDate(timeTools.DateToTimeStamp(new Date().toLocaleDateString()));
    console.log('date', endDate);

    let timeStamp = timeTools.DateToTimeStamp(endDate);
    console.log(timeStamp)
    Post.find({
        'message.chat.id': groupId,
        'message.date': {
            $gt: timeStamp
        }
    }, {
            'message.date': 1,
            'message.from.id': 1,
            'message.text': 1,
            'message.from.first_name': 1,
            'message.from.last_name': 1,
            'message.from.username': 1
        })
        .then(res => {
            let data = res.map(m => {
                return {
                    id: m.message.from.id,
                    text: removeEmojis(m.message.text),
                    date: timeTools.TimeStampToDateTime(m.message.date),
                    name: m.message.from.first_name + (m.message.from.last_name ? ' ' + m.message.from.last_name : ''),
                    userName: m.message.from.username ? '@' + m.message.from.username : undefined
                }
            })
            let result = groupBy(data, 'id');
            let first = data.length > 0 ? data[0].date : undefined;
            let last = data.length > 0 ? data[data.length - 1].date : undefined;
            let diff = first ? (((Date.parse(last) - Date.parse(first)) / 1000.0) / 60.0) / 60.0 : undefined;
            let usernameList = []
            var report = 'تعداد مسیج های ارسالی اعضا\n------------------------------------------\n';
            result.forEach((d, c) => {
                report += `${pad(c + 1)}| ${d.name}  :  ${d.count}\n`;
                usernameList.push(d.userName);
            });

            report += '------------------------------------------\n'
            report += `شروع: ${first ? pc.ToPersianTime(first) : '---'}\n`
            report += `پایان: ${last ? pc.ToPersianTime(last) : '---'}\n`
            report += `مجموع پیام ها: ${data.length}\n`
            report += `متوسط پیام در ساعت: ${diff ? Math.round(data.length / diff) : '---'}\n`
            report += '------------------------------------------\n'
            report += usernameList.filter(m => m).join(',')
            if (data.length > 0)
            bot.sendMessage(chatId, report);
        }
        ).catch(err=>console.log('ERROR',err));
}

weeklyReport = (bot, groupId, chatId) => {
    let startDate = timeTools.OneWeekLater(timeTools.DateToTimeStamp(new Date().toLocaleDateString()));
    let timeStamp = timeTools.DateToTimeStamp(startDate);
    console.log(timeStamp)
    Post.find({
        'message.chat.id': groupId,
        'message.date': {
            $gt: timeStamp
        }
    }, {
            'message.from.id': 1,
            'message.from.first_name': 1,
            'message.from.last_name': 1,
            'message.from.username': 1
        })
        .then(res => {
            let data = res.map(m => {
                return {
                    id: m.message.from.id,
                    name: m.message.from.first_name + (m.message.from.last_name ? ' ' + m.message.from.last_name : ''),
                    userName: m.message.from.username ? '@' + m.message.from.username : undefined
                }
            })
            var result = groupBy(data, 'id')
            let usernameList = []
            var report = 'فعالان گروه در هفته ای که گذشت\n------------------------------------------\n';
            result.forEach((d, c) => {
                report += `${pad(c + 1)}| ${d.name}\n`;
                usernameList.push(d.userName);
            });
            report += '------------------------------------------\n'
            report += `مجموع پیام ها: ${data.length}\n`
            report += '------------------------------------------\n'
            report += usernameList.filter(m => m).join(',')

            if (data.length > 0)
            bot.sendMessage(chatId, report);
        });
}

pad = (d) => {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function removeEmojis(input) {
    if (!input)
        return '---';
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    return input.replace(regex, '');
}


groupBy = (array, key) => {
    let result = [];
    let userId = 0;
    let counter = 0;
    array.forEach(item => {
        if (userId == item.id)
            counter++;
        else {
            userId = item.id;
            counter = 1;
        }
        if (counter <= 5) {
            let tmp = result.find(m => m[key] == item[key])
            if (tmp) {
                let index = result.indexOf(tmp);
                result[index].count++;
            } else
                result.push({
                    id: item.id,
                    userName: item.userName,
                    name: item.name,
                    count: 1
                });
        }
    })
    return result.sort((a, b) => b.count - a.count).map(n => {
        return {
            name: n.name,
            userName: n.userName,
            count: n.count
        }
    });
};



module.exports = {
    Add: add,
    Delete: deletePost,
    DailyReport: dailyReport,
    WeeklyReport: weeklyReport
}