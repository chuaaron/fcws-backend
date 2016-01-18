var UserModel = require('../../models/User');
var PostModel = require('../../models/Post');
var Reply = require('../../models/Reply');
var UserProxy = require('../../proxy/user.js');
var tools = require('../../common/tools');
var eventproxy = require('eventproxy');
var uuid = require('node-uuid');
var _ = require('lodash');
var config = require('../../config/config.js');
var recentCount = config.recentCount;

module.exports.auth = function (req, res, next) {
    var user = req.user;
    if (user) {
        //user.accessToken = uuid.v4();
        //user.save();
        user = _.pick(user, ['id', 'role', 'description',
            'name','district' ,'accessToken']);
        //console.log(user);
        res.status(200).json(user);
    }
};

//修改密码的话需要重新计算盐值和Hash,使用passportLocalMongoose提供的setPassword方法，注意保存
module.exports.changepw = function (req, res, next) {
    req.user.setPassword(req.body.new_password, function (err, user) {
        if (err) {
            next(err);
        }
        if (!user) {
            res.status(403).send("err set new password");
        } else {
            user.save();
            user = _.pick(user, ['id', 'role', 'description',
                'name', 'accessToken']);
            res.status(200).json(user);
        }
    });
};

module.exports.detail = function (req, res, next) {
    var user = req.user;
    var ep = new eventproxy();
    var userid = user.id;

    ep.fail(next);

    ep.all("recent_posts", "recent_replies", function (recent_posts, recent_replies) {
        user = _.pick(user, ['id', 'role', 'description',
            'name']);
        user.recent_posts = recent_posts;
        user.recent_replies = recent_replies;
        res.status(200).json(user);
    });

    //get posts of this user; limited to 5 posts
    PostModel.find({author_id: userid}).sort({create_at: -1}).limit(recentCount).exec(ep.done(function (posts) {
        posts = posts.map(function (post) {
            return _.pick(post, ['_id', 'author_id', 'content', 'important', 'create_at']);
        });
        ep.emit("recent_posts", posts);
    }));

    //get replies of this user; limited to 5 replies
    Reply.find({author_id: userid}).sort({create_at: -1}).limit(recentCount).exec(ep.done(function (replies) {
        replies = replies.map(function (post) {
            return _.pick(post, ['_id', 'author_id', 'post_id', 'content', 'important', 'create_at', 'author']);
        });
        ep.emit("recent_replies", replies);
    }));

};

module.exports.belong = function (req, res, next) {
    var user = req.user;
    var role = user.role;
    var district = user.district ;
    console.log(role + " " + district);

    UserProxy.getBelongsByRoleAndArea(role,district,function(err,users){
        if(err){
            next(err);
        }else {
            users = users.map(function (user) {
                user = _.pick(user, ['id', 'name', 'description','district','town']);
                return user;
            });
            res.status(200).json(users);
        }
    });
};

module.exports.level= function (req, res, next) {
    var user = req.user;
    var role = user.role;
    var district = user.district ;
    console.log(role + " " + district);

    UserProxy.getLevlesByRole(role,function(err,levels){
        if(err){
            next(err);
        }else {
            //users = users.map(function (user) {
            //    user = _.pick(user, ['id', 'name', 'description','district','town']);
            //    return user;
            //});
            res.status(200).json(levels);
        }
    });
};


module.exports.getUsersByArea = function (req, res, next) {
    var district = req.query.district;
    var town = req.query.town;
    UserProxy.getUsersByArea(district, town, function (err, users) {
        if (err) {
            return next(err);
        } else {
            users = users.map(function (user) {
                user = _.pick(user, ['id', 'name', 'phone_no','address']);
                return user;
            });
            res.status(200).json(users);
        }
    });
};

//module.exports.getUsersByName = function (req, res, next) {
//    var name = req.query.name;
//    UserProxy.getUsersByName(name, function (err, users) {
//        if (err) {
//            return next(err);
//        } else {
//
//            res.status(200).json(users);
//        }
//    });
//};

module.exports.searchUsersByName = function (req, res, next) {
    var key = req.query.key;
    if(key === undefined || key.trim() === "" || key === null){
        return res.status(422).send({error_msg: "搜索内容不能为空"});
    }
    var regexp = new RegExp(key,'g');

    UserProxy.serarchUserByRegExp(regexp, function (err, users) {
        if (err) {
            return next(err);
        } else {
            users = users.map(function (user) {
                user = _.pick(user, ['id', 'name', 'phone_no','address']);
                return user;
            });
            res.status(200).json(users);
        }
    });
};



module.exports.getUserById = function (req, res, next) {
    var id = req.query.id;
    UserProxy.getUserById(id, function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(user);
        }
    });
};
