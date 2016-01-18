var MessageModel = require('../../models/Message.js');
var MessageProxy = require('../../proxy/message.js');
var UserModel = require('../../models/User.js');
var UserProxy = require('../../proxy/user.js');
var eventproxy = require('eventproxy');
var _ = require('lodash');

//module.exports.create = function (req, res, next) {
//    var content = req.body.content;
//    var receiver_id = req.body.receiver_id || "";
//    var sender_id = req.user.id;
//    var sender = req.user;
//
//    if (content === undefined || content === '') {
//        return res.status(422).send({error_msg: "命令内容不能为空"});
//    }
//
//    var ep = new eventproxy();
//    ep.fail(next);
//
//    UserModel.findOne({id: receiver_id}).exec(ep.done('receiver'));
//    ep.all('receiver', function (receiver) {
//        //if the receiver is not existed,then error
//        if (!receiver) {
//            return res.status(404).send({error_msg: "接受者不存在"});
//        }
//
//        //user in role 6 has no rights to send a command
//        var senderRole6 = (sender.role === 6);
//
//        //sender role should more than receiver id by 1
//        var sender_more_receiver = (sender.role >= receiver.role );
//        var minus_not_1 = ((receiver.role - sender.role) !== 1);
//        // if sender's role is lower than 3,they should be in the same area;
//        var role_not_in_same_area = (sender.role >= 4 && sender.area !== receiver.area);
//
//        if (senderRole6 || sender_more_receiver || minus_not_1 || role_not_in_same_area) {
//            return res.status(403).send({error_msg: "你没有权限"});
//        }
//
//        MessageProxy.newAndSave(sender_id, receiver_id, content, function (err, message) {
//            if (err) {
//                return res.status(400).send({error_msg: err.message});
//            } else {
//                message = _.pick(message, ['id', 'sender_id', 'receiver_id', 'content', 'has_read', 'create_at']);
//                return res.status(200).json(message);
//            }
//        });
//    });
//};



// here we should examine the sender role and reciever role
module.exports.levels = function (req, res, next) {
    var sender_role = req.user.role;
    var sender_district = req.user.district;
    var sender_id = req.user.id;
    var content = req.body.content;
    var selection = req.body.selection || [];

    if (!content) {
        return res.status(422).send({error_msg: "命令内容不能为空"});
    }

    if (selection.length === 0) {
        return res.status(422).send({error_msg: "接受者不能为空"});
    }

    var ep = new eventproxy();

    selection.forEach(function (level) {
        var receiver_role = level.level;
        MessageProxy.BroadLevel(sender_id, sender_district,sender_role,receiver_role, content, ep.done('message'));

    });

    ep.after('message', selection.length, function () {
        //too big ,not to send messages
        res.status(200).json({success: true});
    });
}


module.exports.reply = function (req, res, next) {
    var sender_id = req.user.id;
    var content = req.body.content;
    var receiver_id= req.body.receiver_id;

    if (!content) {
        return res.status(422).send({error_msg: "回复内容不能为空"});
    }
    
    MessageProxy.newAndSave(sender_id, receiver_id, content, function(err,message){
        if(err){
           return  next(err);
        }
        res.status(200).json({success: true});
    });
}

// here we should examine the sender role and reciever role
module.exports.broadcast = function (req, res, next) {
    //var role = req.user.role;
    //var district = req.user.district;
    var sender_id = req.user.id;
    var content = req.body.content;
    var selection = req.body.selection || [];

    if (!content) {
        return res.status(422).send({error_msg: "命令内容不能为空"});
    }

    if (selection.length === 0) {
        return res.status(422).send({error_msg: "接受者不能为空"});
    }

    var ep = new eventproxy();

    selection.forEach(function (receiver) {
        var receiver_id = receiver.id;
        MessageProxy.newAndSave(sender_id, receiver_id, content, ep.done('message'));
    });

    ep.after('message', selection.length, function (err,messages) {
        //too big ,not to send messages
        res.status(200).json({success: true});
    });


    //UserProxy.getBelongsByRoleAndArea(role, district, function (err, users) {
    //    if (err || !users) {
    //        return next(err);
    //    }
    //
    //    if (users.length === 0) {
    //        return res.status(403).send({error_msg: "你没有可以发送命令的人"});
    //    }
    //
    //    var ep = new eventproxy();
    //    ep.fail(next);
    //
    //    users.forEach(function (user) {
    //        var receiver_id = user.id;
    //        MessageProxy.newAndSave(sender_id, receiver_id, content, ep.done('message'));
    //    });
    //
    //    ep.after('message', users.length, function (messages) {
    //        //too big ,not to send messages
    //        res.status(200).json({success: true});
    //    });
    //});
};


//TODO: test
module.exports.unread = function (req, res, next) {
    var receiver_id = req.user.id;

    MessageModel.find({receiver_id: receiver_id, has_read: false}).count(function (err, count) {
        if (err) {
            return next(err);
        }
        res.status(200).json({count: count});
    });
};


//TODO: test
module.exports.list = function (req, res, next) {
    var receiver_id = req.user.id;

    var ep = new eventproxy();
    ep.fail(next);

    ep.all('has_read', 'has_not_read', function (has_read_messages, hasnot_read_messages) {
        var messages = {};
        messages.has_read_messages = has_read_messages;
        messages.hasnot_read_messages = hasnot_read_messages;
        res.status(200).json(messages);
    });
    MessageProxy.getMessagesById(receiver_id, true, ep.done('has_read'));
    MessageProxy.getMessagesById(receiver_id, false, ep.done('has_not_read'));
};


//TODO: test
module.exports.markall = function (req, res, next) {
    MessageModel.update({
        receiver_id: req.user.id,
        has_read: false
    }, {has_read: true}, {multi: true}, function (err, messages) {
        if (err) {
            next(err);
        } else {
            res.status(200).json({success: true});
        }
    });
};



