var ReplyModel  = require('../models/Reply');


module.exports.newAndSave = function(author_id,post_id,content,callback){
    var reply = new ReplyModel();
    reply.author_id = author_id;
    reply.content = content;
    reply.post_id = post_id;

    reply.save(callback);
};

module.exports.getReplyById = function(reply_id,callback){
    ReplyModel.findById(reply_id,callback);
};