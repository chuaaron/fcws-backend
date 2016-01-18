var PostModel  = require('../models/Post.js');
var UserProxy  = require('./user');
var eventproxy = require('eventproxy');


module.exports.newAndSave = function(authorId,content,photos,important,callback){
    var post = new PostModel();
    post.author_id = authorId;
    post.content = content;
    post.important = important;
    post.photos = photos;

    post.save(callback);
};

module.exports.getPostsByQuery = function(query,options,callback){
   PostModel.find(query,null,options).exec(function(err,posts){
        if(err){
            return callback(err);
        }

        if(posts.length == 0){
            return callback(null,[]);
        }

       var ep = eventproxy();
       ep.fail(callback);

       posts.map(function(post){

       });

       //TODO
       //get posts;
       //UserProxy.getUserById()

   });
};

module.exports.getPostById = function(post_id,callback){
    PostModel.findById(post_id,callback);
};