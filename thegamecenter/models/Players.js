var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
    userName: String,
    realName: String,
    author: String,
    age: Number,
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}]
});

mongoose.model('Player', PlayerSchema);