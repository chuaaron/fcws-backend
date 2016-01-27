var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		trim: true
	},
	password: String,
	name: String,
	district: String,
	town: String,
	description: String,
	role: Number,
	address: String,
	phone_no: String,
	accessToken: String,
	avatar: String
}, { id: false });

//area:
//level3以上的人一个区为0区，靖江1区，泰兴2区，姜堰3区，兴化4区，海陵5区，高港6区，高新7区。
var options = {};
options.iterations = 250;
options.usernameField = 'id';
options.errorMessages = {};
options.errorMessages.IncorrectPasswordError = '用户名或密码错误!';
options.errorMessages.IncorrectUsernameError = '用户名或密码错误!';

UserSchema.plugin(passportLocalMongoose,options);

module.exports = mongoose.model('User', UserSchema);
