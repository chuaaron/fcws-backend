var PostModel = require('../models/Post.js');
var ReplyModel = require('../models/Reply.js');
var lengthLimit = 15;
var eventproxy = require('eventproxy');

module.exports.index = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || 10;
    var id = req.query.search || "";
    var keyword = req.query.search || "";
    var regexp_id = new RegExp("^"+ id);
    var regexp_keyword = new RegExp(keyword,'g');

    PostModel.find({ $or:[ {author_id : regexp_id}, {content:regexp_keyword}]}).skip(limit * (page - 1)).limit(limit).sort({create_at: -1}).exec(function (err, posts) {
        if(err || !posts){
            req.flash("error", "未知错误");
            return res.status(500).json();
        }
        posts= posts.map(function(post){
            if(post.content.length > lengthLimit){
                post.content = post.content.slice(0,lengthLimit)+"...";
            }
            return post;
        });
        res.render('posts', {title: "情报管理", posts: posts, page: page,search:id});
    });
};

module.exports.delete = function (req, res, next) {
    var post_id= req.params.id;
    var ep = new eventproxy();
    ep.fail(next);

    PostModel.findById(post_id).exec(function (err, post) {
        //error occurred
        if (err) {
            req.flash("error", "未知错误");
            return res.status(500).json();
        }

        //404 not found
        if (!post) {
            req.flash("error", "情报" + post_id + "不存在!");
            return res.status(404).send({'error_msg': 'post' + post_id + ' not found'});
        }

        //204 NO CONTENT - [DELETE]：用户删除数据成功。
        ep.all("remove_post", "remove_replies", function () {
            req.flash("success", "情报" + post_id + "及其相关回复已被删除!");
            res.status(204).end();
        });

        PostModel.findByIdAndRemove(post_id).exec(ep.done("remove_post"));
        ReplyModel.find({post_id: post_id}).remove().exec(ep.done("remove_replies"));
    });
};