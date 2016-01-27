var MessageModel = require('../models/Message.js');
var UserModel = require('../models/User.js');
var UserProxy = require('../proxy/user.js');

var eventproxy = require('eventproxy');
var _ = require('lodash');

var newAndSave = module.exports.newAndSave = function (sender_id, receiver_id, content, callback) {
    var message = new MessageModel();
    message.sender_id = sender_id;
    message.receiver_id = receiver_id;
    message.content = content;
    message.has_read = false;

    message.save(callback);
};

module.exports.BroadLevel = function (sender_id, sender_district,sender_role,receiver_role, content, callback) {
    var ep = new eventproxy();
    ep.fail(callback);

    if(sender_role === 1 || sender_role === 2 || sender_role ===3 ){
        UserProxy.getUsersByRole(receiver_role,ep.done('receivers'));
    }else if(sender_role === 4 || sender_role === 5){
        UserProxy.getUsersByRoleAndArea(receiver_role,sender_district,ep.done('receivers'));
    }else{
        var receivers = [];
        ep.emit('receivers',receivers);
    }

    ep.on('receivers',function(receivers){
        receivers.forEach(function (receiver) {
            newAndSave(sender_id, receiver.id, content, ep.done('send'));
        });

        ep.after('send',receivers.length,function(messages){
            callback(null,messages);
        })
    })


};


module.exports.getMessagesById = function (receiver_id, has_read, callback) {
    MessageModel.find({
        receiver_id: receiver_id,
        has_read: has_read
    }).sort({create_at: -1}).exec(function (err, messages) {
        if (err) {
            return callback(err);
        }

        var ep = new eventproxy();

        messages.forEach(function (message) {
            UserModel.findOne({id: message.sender_id}).exec(function (err, user) {
                if (err) {
                    return callback(err);
                }
                message.sender = _.pick(user, 'id','name', 'description','avatar');
                ep.emit('user');
            });
        })
        ep.after('user', messages.length, function () {
            messages = messages.map(function (message) {
                return _.pick(message, ['content', 'create_at', 'sender']);
            });
            return callback(null, messages);
        });
    });
}

