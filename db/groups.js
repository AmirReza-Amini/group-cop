const mongoose = require('./db');


const groupSchema = mongoose.Schema({
    groupId: {
        type: Number
    },
    name: {
        type: String
    },
    lock: {
        type: {}
    },
    deleteFreqMsgs:{}
});

const groupModel = mongoose.model('groups', groupSchema);
module.exports = groupModel;