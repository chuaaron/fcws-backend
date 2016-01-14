var MessageModel = require('../models/Message.js');
var UserModel = require('../models/User.js');

var eventproxy = require('eventproxy');
var _ = require('lodash');

module.exports.newAndSave = function (sender_id, receiver_id, content, callback) {
    var message = new MessageModel();
    message.sender_id = sender_id;
    message.receiver_id = receiver_id;
    message.content = content;
    message.has_read = false;

    message.save(callback);
};


module.exports.getMessagesById = function (receiver_id,has_read ,callback) {
    MessageModel.find({receiver_id: receiver_id, has_read: has_read}).sort({create_at: -1}).exec(function (err, messages) {
        if (err) {
            return callback(err);
        }

        var ep = new eventproxy();

        messages.forEach(function (message) {
            UserModel.findOne({id: message.sender_id}).exec(function (err, user) {
                if (err) {
                    return callback(err);
                }
                message.sender = _.pick(user, 'name', 'description');
                ep.emit('user');
            });
        })
        ep.after('user',messages.length,function(){
            messages = messages.map(function (message) {
                return _.pick(message, ['content', 'create_at', 'sender']);
            });
           return callback(null,messages);
        });
    });
}

