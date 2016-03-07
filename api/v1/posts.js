var PostModel = require('../../models/Post');
var PostProxy = require('../../proxy/post');
var ReplyModel = require('../../models/Reply');
var UserModel = require('../../models/User');
var validator = require('validator');
var _ = require('lodash');
var config = require('../../config/config.js');
var eventproxy = require('eventproxy');


module.exports.list = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || 10;

    var ep = new eventproxy();
    ep.fail(next);

    PostModel.find().skip(limit * (page - 1)).limit(limit).sort({create_at: -1}).exec(ep.done('posts'));

    ep.all('posts', function (posts) {
        posts.forEach(function (post) {
            UserModel.findOne({id: post.author_id}, ep.done(function (author) {
                post.author = _.pick(author, ['name','role','description','avatar']);
                ep.emit('author');
            }))
        })

        ep.after('author', posts.length, function () {
            posts = posts.map(function (post) {
                return _.pick(post, ['_id', 'author_id', 'content', 'important', 'create_at', 'author']);
            });
            res.status(200).json(posts);
        })
    });

};

module.exports.show = function (req, res, next) {
    var postId = req.params.id;
    var ep = new eventproxy();
    ep.fail(next);

    PostModel.findById(postId).exec(ep.done('post'));

    ReplyModel.find({post_id: postId}).exec(ep.done(function (replies) {

        replies.forEach(function (reply) {
            UserModel.findOne({id: reply.author_id}).exec(ep.done(function (author) {
                reply.author = _.pick(author, ['name','role','description','avatar']);
                ep.emit('author');
            }));
        });

        ep.after('author', replies.length, function () {
            replies = replies.map(function (reply) {
                return _.pick(reply, ['_id', 'author_id', 'post_id', 'content', 'create_at', 'author']);
            });
            ep.emit('replies', replies);
        })

    }));

    ep.all('post', 'replies', function (post, replies) {
        if (!post) {
            return res.status(400).send("err in find post by id");
        }
        post.replies = replies || [];
        UserModel.findOne({id: post.author_id}).exec(ep.done(function (author) {
            post.author = _.pick(author, ['name','role','description','avatar']);
            ep.emit('author');
        }));

        ep.all('author', function () {
            post = _.pick(post, ['_id', 'author_id', 'content', 'important', 'photos', 'create_at', 'author', 'replies']);
            //console.log(post);
            res.status(200).json(post);
        })
    });

    //PostModel.findById(req.params.id).exec(function (err, post) {
    //    if (err || !post) {
    //        res.status(400).send("err in find post by id");
    //    } else {
    //        ReplyModel.find({postId: post._id}).exec(function (err, replies) {
    //            if (err) {
    //                res.status(400).send("err in find replys by post id");
    //            } else {
    //                var data = post.toObject();
    //                data.replies = replies;
    //                res.status(200).json(data);
    //            }
    //        });
    //    }
    //});
};

module.exports.upload = function (req, res, next) {
    console.info("upload...");
    //console.log(req.body) // form fields
    console.log(JSON.stringify(req.file)); // form files
    //check if the files are empty
    //var urls = _.pluck(req.file,'path');
    //var base_url    = config.upload.url;
    if(!req.file){
       return  res.status(404).send("error file not defined");
    }
    var filename= req.file.filename;
    console.log(filename);
    res.status(200).json({filename: filename});
};

module.exports.create = function (req, res, next) {
    var authorId = req.user.id;
    var content = validator.trim(req.body.content);
    var important = req.body.important || false;
    var photos = req.body.photos || [];

    //进行验证
    //if (content === undefined && content === '') {
    //    return res.status(422).send({error_msg: "内容不能为空"});
    //}

    PostProxy.newAndSave(authorId, content, photos, important, function (err, post) {
        if (err) {
            return next(err);
        } else {
            post = _.pick(post, ['_id', 'author_id', 'content', 'important', 'create_at']);
            res.status(200).json(post);
        }
    });
};

// module.exports.like = function (req, res, next) {
//   console.log("\nlike a post");
//   PostModel.
//   findByIdAndUpdate(req.params.id,
//   { $addToSet: {"likes": req.user.id}},
//   { safe: true, upsert: true, new: true})
//   .exec(function (err, post) {
//     if (err || !post) {
//       res.status(400).send("post not found or update error");
//     } else {
//       res.status(200).json({'likes': post.likes});
//     }
//   });
// };

// module.exports.unlike = function (req, res, next) {
//   console.log("\nunlike a post");
//   PostModel.findByIdAndUpdate(req.params.id,{ $pull: {"likes": req.user.id}}).exec(function (err, post) {
//     if (err) {
//       res.status(400).send("error unlike");
//     } else {
//       res.status(200).json({});
//     }
//   });
// };

module.exports.delete = function (req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);
    var post_id = req.params.id;
    var user_id = req.user.id;

    PostModel.findById(post_id).exec(function (err, post) {
        //error occurred
        if (err) {
            return next(err);
        }

        //404 not found
        if (!post) {
            return res.status(404).send({'error_msg': 'post' + post_id + ' not found'});
        }

        //Forbidden 表示用户得到授权（与401错误相对），但是访问是被禁止的。
        if (post.author_id !== user_id) {
            return res.status(403).send({error_msg: "Forbidden"});
        }

        //204 NO CONTENT - [DELETE]：用户删除数据成功。
        ep.all("remove_post", "remove_replies", function () {
            res.status(204).end();
        });

        PostModel.findByIdAndRemove(post_id).exec(ep.done("remove_post"));
        ReplyModel.find({post_id: post_id}).remove().exec(ep.done("remove_replies"));
    });
};
