var express = require('express');
var router = express.Router();

var contentController = require('./controllers/contents.js');
var logController = require('./controllers/log.js');
var districtController = require('./controllers/district.js');
var userController = require('./controllers/users.js');
var postController = require('./controllers/posts.js');
var apkController = require('./controllers/apk.js');

var passport          = require('passport');

function checkLogin(req, res, next) {
    if (!req.session.passport) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}

//log
router.get('/', function (req, res, next) {
    res.redirect('/login');
});
router.get('/login',logController.showLogin);
router.post('/login',passport.authenticate('local',{session:true,failureRedirect: '/login',
    failureFlash: true}) ,logController.login);

router.get('/logout',logController.logout);
router.get('/chpwd',checkLogin,logController.chpwd);
router.post('/chpwd',checkLogin,logController.updatepwd);


router.get('/apk',checkLogin,apkController.apk);
router.post('/apk',checkLogin,apkController.update);

//contents
router.get('/contents',checkLogin,contentController.index);
router.get('/contents/new',checkLogin,contentController.editor);
router.get('/contents/:id/editor',checkLogin,contentController.showEditor);

router.post('/contents/create',checkLogin,contentController.create);
router.post('/contents/:id/update',checkLogin,contentController.update);

router.delete('/contents/:id',checkLogin,contentController.delete);

//contacts
router.get('/districts',checkLogin,districtController.districts);
router.get('/towns',checkLogin,districtController.towns);
router.get('/towns/new',checkLogin,districtController.new_towns);
router.get('/towns/:name/edit',checkLogin,districtController.edit_towns);

router.post('/towns/create',checkLogin,districtController.create_towns);
router.post('/towns/:name/update',checkLogin,districtController.update_towns);

router.get('/contacts',checkLogin,userController.users);
router.delete('/towns',checkLogin,districtController.delete_towns);

// new -> create
// edit -> update

//users
router.get('/users',checkLogin,userController.index);
router.get('/users/new',checkLogin,userController.new);
router.get('/users/:id/edit',checkLogin,userController.edit);

router.post('/users/create',checkLogin,userController.create);
router.post('/users/:id/update',checkLogin,userController.update);

router.delete('/users/:id',checkLogin,userController.delete);

//posts
router.get('/posts',checkLogin,postController.index);
router.delete('/posts/:id', checkLogin,postController.delete);

module.exports = router;