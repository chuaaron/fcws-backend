var ReplyModel = require('../../models/Reply');
var ReplyProxy = require('../../proxy/reply');
var PostProxy = require('../../proxy/post');
var MessageProxy = require('../../proxy/message');
var validator = require('validator');
var _ = require('lodash');

//POST
module.exports.create = function (req, res, next) {
    var author_id = req.user.id;
    var author_name = req.user.description + " " + req.user.name;
    var post_id = req.body.post_id;
    var content = validator.trim(req.body.content);

    //422 当创建一个对象时，发生一个验证错误
    if (content === undefined || content === '') {
        return res.status(422).send({error_msg: "content should not be empty"});
    }

    //如果post不存在
    PostProxy.getPostById(post_id, function (err, post) {
        //if(err ){
        //    return next(err);
        //}
        if (err || !post) {
            return res.status(404).send({'error_msg': "post " + post_id + ' not found'});
        }
        ReplyProxy.newAndSave(author_id, post_id, content, function (err, reply) {
            if (err) {
                return next(err);
            } else {
                if(author_id !== post.author_id){
                    content ="您的情报< "+post.content+" >有新的回复," + " 内容为: " + content;
                    MessageProxy.newAndSave(author_id, post.author_id, content, function(err,message){
                        if(err){
                            return next(err);
                        }else{
                            res.status(200).json({success: true});
                        }
                    });
                }else{
                    res.status(200).json({success: true});
                }

                //var reply = _.pick(reply, ['_id', 'post_id', 'content', 'author_id', 'create_at']);

            }
        });
    })
};

module.exports.delete = function (req, res, next) {
    //only the author can delete the reply
    var reply_id = req.params.id;
    var user_id = req.user.id;
    ReplyProxy.getReplyById(reply_id,function(err,reply){
        if(err){
            return next(err);//500
        }
        //404
        if(!reply){
           return res.status(404).send({'error_msg':'reply ' + reply_id +' not found'});

        }

        //Forbidden 表示用户得到授权（与401错误相对），但是访问是被禁止的。
        if(reply.author_id !== user_id){
            return res.status(403).send({error_msg : "Forbidden"});
        }

        ReplyModel.findByIdAndRemove(reply_id, function (err, reply) {
            if (err || !reply) {
                res.status(400).send({'error_msg':"err in delete reply"});
            } else {
                res.status(204).end();
            }
        });
    });
};
