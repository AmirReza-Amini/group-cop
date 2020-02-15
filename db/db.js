const mongoose = require('mongoose');

url = "mongodb://127.0.0.1:27017/GroupCopDb";
mongoose.connect(url, {
    useNewUrlParser: true
});
mongoose.Promise = Promise;
module.exports = mongoose;