var mongoose = require('mongoose');

var ReplySchema = new mongoose.Schema({
	author_id: {type: String},
	post_id: {type: String},
	content: {type: String},
	create_at :{type:Date, default : Date.now},
});

module.exports = mongoose.model('Reply', ReplySchema);



