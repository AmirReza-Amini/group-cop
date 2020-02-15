const mongoose = require('./db');

const logSchema = mongoose.Schema({
    text: {
        type: String
    },
    date: {
        type: Date
    }
});

const logModel = mongoose.model('logs', logSchema);
module.exports = logModel;