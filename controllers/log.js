var UserProxy = require('../proxy/user.js');
var config = require('../config/config.js');

module.exports.showLogin= function(req,res,next){
    res.render('login', {title: "管理员登录"});
};

module.exports.chpwd= function(req,res,next){
    res.render('chpwd', {title: "管理员密码修改"});
};

module.exports.updatepwd= function(req,res,next){
    var password = req.body.password.trim();
    var new_password = req.body.new_password.trim();
    var repeat_password = req.body.repeat_password.trim();
    if(!password ||!repeat_password || !new_password){
        req.flash('error', "密码不完整!");
        return res.redirect('/chpwd');
    }

    if(new_password !== repeat_password){
        req.flash('error', "密码不一致!");
        return res.redirect('/chpwd');
    }

    UserProxy.getUserById(req.session.passport.user,function(err,admin){
        if(err || !admin){
            req.flash('error', "获取管理员信息出错!");
            return res.redirect('/chpwd');
        }
        admin.authenticate(password,function(err,success){
            if(err || !success){
                req.flash('error', "密码错误!");
                return res.redirect('/chpwd');
            }
            admin.setPassword(new_password, function (err, user) {
                if (err) {
                    req.flash('error', "设置密码出错!");
                    return res.redirect('/chpwd');
                } else {
                    user.save();
                    req.flash('success', "设置密码成功!");
                    return res.redirect('/users');
                }
            });
        });
    });
};


module.exports.login= function (req, res, next) {
    console.log("come here");
    var user = req.user;
    console.log(user);
    if(user.role !== -1 ){
        req.flash('error', "非管理员用户!");
        return res.redirect('/login');
    }else{
        //req.session.user = user;
        req.flash('success', "登录成功!");
        return res.redirect('/users');
    }
    //if (admin.name === config.admin.username && admin.password === config.admin.password) {
    //
    //} else {
    //    req.flash('signupError', "用户名或密码错误");
    //    res.redirect('/login');
    //}
};

module.exports.logout = function (req, res, next) {
    req.logout();
    //req.flash('success', '登出成功');
    res.redirect('/login');
};

//module.exports.login= function (req, res, next) {
//    var admin = {};
//    admin.name = req.body.username;
//    admin.password = req.body.password;
//    if (admin.name === config.admin.username && admin.password === config.admin.password) {
//        req.session.user = admin;
//        res.redirect('/users');
//    } else {
//        req.flash('signupError', "用户名或密码错误");
//        res.redirect('/login');
//    }
//};

module.exports.logout = function (req, res, next) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/login');
};