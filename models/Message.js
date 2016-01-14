var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	sender_id: String,
	receiver_id: String,
	content: String,
	has_read: {type: Boolean, defalut: false},
	create_at: {type:Date, default : Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);