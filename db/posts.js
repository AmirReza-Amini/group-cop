const mongoose = require('./db');

const postSchema = mongoose.Schema({
    message: {
        type: {}
    }
});

const postModel = mongoose.model('posts', postSchema);
module.exports = postModel;