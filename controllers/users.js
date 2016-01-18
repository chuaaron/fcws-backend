var UserModel = require('../models/User.js');
var UserProxy = require('../proxy/user.js');
var DistrictProxy = require('../proxy/district.js');
var eventproxy = require('eventproxy');
var config = require('../config/config.js');

module.exports.index = function(req,res,next){
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || 10;
    var id = req.query.search || "";
    var regexp = new RegExp("^"+ id);

    UserModel.find({ id:regexp}).skip(limit * (page - 1)).limit(limit).sort({id: 1}).exec(function (err, users) {
        res.render('users/index', {title: "用户管理", users: users, page: page,search :id});
    });
};

module.exports.new = function(req,res,next){
    DistrictProxy.getDistricts(function(err,districts){
        if(err || !districts){
            req.flash("error", "区域获取错误");
            return res.redirect('/users');
        }
        districts = districts.map(function(district){
            return district.name;
        });
        res.render('users/edit', {title: "新增用户",action: "create",roles: config.roles,districts: districts,towns:[]});
    });
};

module.exports.edit= function(req,res,next){
    var user_id = req.params.id;
    UserProxy.getUserById(user_id,function(err,user){
        if(err || !user){
            req.flash("error", "用户不存在或已被删除");
            return  res.redirect('/users');
        } else{
            DistrictProxy.getDistricts(function(err,districts){
                if(err || !districts){
                    req.flash("error", "区域获取错误");
                    return res.redirect('/users');
                }
                console.log(districts);
                var towns = [];
                if(user.district !== ''){
                    for(var i = 0 ; i< districts.length;i++){
                        if(districts[i].name === user.district){
                            towns = districts[i].towns;
                            break;
                        }
                    }
                }

                districts = districts.map(function(district){
                   return district.name;
                });

                res.render('users/edit', {
                    title: "编辑用户",
                    cur_user: user,
                    action: "edit",
                    roles: config.roles,
                    districts: districts,
                    towns: towns
                });
            });
        }

    });
};

module.exports.create = function(req,res,next){
    var id = req.body.id;
    var password = id;
    var phone_no = id;
    var username = req.body.username;
    var role = req.body.role;
    var description = req.body.description;
    var district = req.body.district;
    var town = req.body.town;
    var address = req.body.address;


    UserProxy.newAndSave(id, password, username,district,town, description, role,address,phone_no, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect('/users');
        } else {
            req.flash('success', '新用户<' + user.name + '>创建成功');
            res.redirect('/users');
        }
    })
};

module.exports.update= function(req,res,next){
    var id_old = req.params.id;
    var id = req.body.id;
    var phone_no = id;
    var username = req.body.username;
    var role = req.body.role;
    var description = req.body.description;
    var district = req.body.district;
    var town = req.body.town;
    var address = req.body.address;

    UserProxy.updateUserById(id_old,id,username,district,town, description, role,address,phone_no,function(err,user){
            if (err || !user) {
                req.flash("error","更新出错,请检查是否已有相同id的用户存在");
                return res.redirect('/users');
            } else {
                req.flash('success', '用户' + user.name + '信息更新成功');
                res.redirect('/users');
            }
    });
};

module.exports.delete= function(req,res,next){
    var user_id = req.params.id;
    var ep = new eventproxy();
    ep.fail(next);
    UserModel.find({id: user_id}).exec(function (err, user) {
        if (err) {
            req.flash("error", "未知错误");
            return res.status(500).json();
        }

        //404 not found
        if (!user) {
            req.flash("error", "用户" + user_id + "不存在!");
            return res.status(404).send({'error_msg': 'user ' + user_id + ' not found'});
        }

        //204 NO CONTENT - [DELETE]：用户删除数据成功。
        ep.all("remove_user", function () {
            req.flash("success", "用户" + user_id + "已被删除!");
            res.status(204).json();
        });

        UserModel.findOne({id: user_id}).remove().exec(ep.done("remove_user"));
    });
};

module.exports.users = function (req, res, next) {
    var district = req.query.district;
    var town = req.query.town;
    console.log(district + " " + town);
    UserProxy.getUsersByArea(district, town, function (err, users) {
        if (err) {
            return next(err);
        } else {
            console.log(users);
            res.status(200).json(users);
        }
    });
};

