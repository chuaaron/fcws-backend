var UserModel = require('../models/User');
var uuid = require("node-uuid");
var eventproxy = require('eventproxy');
var _ = require('lodash');

module.exports.newAndSave = function (id, password, name, district, town, description, role, address, phone_no, callback) {
    var user = new UserModel();
    user.id = id;
    user.name = name;
    user.district = district;
    user.town = town;
    user.description = description;
    user.role = role;
    user.address = address;
    user.phone_no = phone_no;
    user.accessToken = uuid.v4();
    UserModel.register(user, password, callback);
};

module.exports.getUserById = function (id, callback) {
    UserModel.findOne({id: id}, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, user);
        }
    });
};

module.exports.updateUserById = function (id_old, id, name, district, town, description, role, address, phone_no, callback) {
    var user = {};
    user.id = id;
    user.name = name;
    user.district = district;
    user.town = town;
    user.description = description;
    user.role = role;
    user.address = address;
    user.phone_no = phone_no;

    UserModel.findOneAndUpdate({id: id_old}, user, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, user);
        }
    });
};

module.exports.getUsersByArea = function (district, town, callback) {
    UserModel.find({district: district, town: town}, function (err, users) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, users);
        }
    });
};

module.exports.getUsersByName = function (name, callback) {
    UserModel.find({name: name}, function (err, users) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, users);
        }
    });
};

module.exports.deleteUserById = function (id, callback) {
    UserModel.findOneAndRemove({id:id}, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, user);
        }
    });
};

module.exports.serarchUserByRegExp = function(regexp,callback){
    UserModel.find({name: regexp}).sort({name : 1}).exec(function(err,users){
        if (err) {
            return callback(err);
        } else {
            return callback(null, users);
        }
    });
}

//TODO
module.exports.getBelongsByRoleAndArea = function(role,district,callback){
    //if role not right
    if(role === undefined || role > 6){
        var error = {};
        error.message = "role not in "
      callback(null,null);
    }

    if(district === undefined || district < 0 || district > 7){
        callback(null,null);
    }

    var ep = new eventproxy();

    if (role === 1 || role === 2 || role === 3) {
        UserModel.find({"role": role + 1}).sort({id: 1}).exec(ep.done('users'));
    } else if (role === 4 || role === 5) {
        UserModel.find({"role": role + 1, "district": district}).sort({id: 1}).exec(ep.done("users"));
    } else {
        var users = [];
        callback(null,users);
        //ep.emit('users',users);
    }

    ep.all('users', function (users) {
        callback(null,users);
    });
};
