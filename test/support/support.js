var UserProxy = require('../../proxy/user');
var PostProxy = require('../../proxy/post');
var ContentProxy  = require('../../proxy/content.js');
var ReplyProxy = require('../../proxy/reply');
var UserModel = require('../../models/User');
var _  = require('lodash');






function randomInt() {
    return (Math.random() * 10000).toFixed(0);
}

module.exports.createUser = function (callback) {
    var key = new Date().getTime() + "_" + randomInt();
    var id = key;
    var password = id;
    var name = "test" + "_" + id;
    var role = _.random(1,6);
    UserProxy.newAndSave(id, password, name,'','','', role,'','', callback);
};

module.exports.createUserWithRoleAndArea= function (role,district,callback) {

    var key = new Date().getTime() + "_" + randomInt();
    var id = key;
    var password = id;
    var name = "test" + "_" + id;
    var role = role;
    var district = district;
    UserProxy.newAndSave(id, password, name,district,'', '',role,'','',callback);
};


var main = ['train','education','defence'];


var pickSubCategory = function(category){
    var train = ['plan','rule','search','exam'];
    var education = ['plan','edu','rule','achieve'];
    var defence = ['organization','rule','call','potential'];

    var sub_category = '';
    if(category === 'train'){
        sub_category = _.sample(train);
    }else if(category === 'education'){
        sub_category = _.sample(education);
    }else if(category === 'defence'){
        sub_category = _.sample(defence);
    }else{
        sub_category = 'unknown';
    }
    return sub_category;
};

module.exports.createContent = function (callback) {
    var key = new Date().getTime() + "_" + randomInt();
    var title = 'title_' + key;
    var category = _.sample(main);
    var sub_category  = pickSubCategory(category);
    var details = '###Hello,Calvin post content ' + key;

    ContentProxy.newAndSave(title,category,sub_category,details,callback);
};


module.exports.createPost = function (author_id, callback) {
    var key = new Date().getTime() + "_" + randomInt();
    PostProxy.newAndSave(author_id, 'Calvin post content ' + key, [], true, callback);
};

module.exports.createReply = function (author_id, post_id, callback) {
    var key = new Date().getTime() + "_" + randomInt();
    ReplyProxy.newAndSave(author_id, post_id, 'Calvin reply content ' + key, callback);
};