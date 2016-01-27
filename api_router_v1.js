var express           = require('express');
// var middleware        = require('./api/v1/middleware');
var userController    = require('./api/v1/user');
var toolsController   = require('./api/v1/tools');
var postController    = require('./api/v1/posts');
var replyController   = require('./api/v1/replys');
var messageController = require('./api/v1/messages');
var districtController = require('./api/v1/districts');
var contentController = require('./api/v1/contents');
var updateController =  require('./api/v1/update');

var passport          = require('passport');
var router            = express.Router();
var multer            = require('multer');
var upload            = multer({ dest: './public/uploads/'});

/* 得到用户的token */
router.get('/auth/local', passport.authenticate('local', {session: false}), userController.auth);

/*  accessToken 测试 */
router.get('/accesstoken', passport.authenticate('bearer', { session: false }), toolsController.accesstoken);

router.post('/users/changePassword',passport.authenticate('local', { session: false }),userController.changepw);

router.post('/users/avatar',passport.authenticate('bearer', { session: false }),userController.uploadAvatar);

//router.get('/users/details',passport.authenticate('bearer', { session: false }),userController.detail);

router.get('/users/recentposts',passport.authenticate('bearer', { session: false }),userController.recentposts);

router.get('/users/recentreplies',passport.authenticate('bearer', { session: false }),userController.recentreplies);

router.get('/users/belongs',passport.authenticate('bearer', { session: false }),userController.belong);

router.get('/users/levels',passport.authenticate('bearer', { session: false }),userController.level);

router.get('/posts',passport.authenticate('bearer', { session: false }),postController.list);

router.get('/posts/:id',passport.authenticate('bearer', { session: false }),postController.show);

router.post('/posts',passport.authenticate('bearer', { session: false }),postController.create);

router.delete('/posts/:id',passport.authenticate('bearer', { session: false }),postController.delete);

router.post('/replys',passport.authenticate('bearer', { session: false }),replyController.create);

router.delete('/replys/:id',passport.authenticate('bearer', { session: false }),replyController.delete);


router.post('/upload',passport.authenticate('bearer', { session: false }),upload.single('photo') ,postController.upload);

router.get('/update',passport.authenticate('bearer', { session: false }) ,updateController.update);

//router.get('/belongs',passport.authenticate('bearer', { session: false }),postController.create);

//router.get('/contacts',passport.authenticate('bearer', { session: false }),postController.create);

//router.post('/messages',passport.authenticate('bearer', { session: false }),messageController.create);

router.post('/messages/broadcast',passport.authenticate('bearer', { session: false }),messageController.broadcast);

router.post('/messages/levels',passport.authenticate('bearer', { session: false }),messageController.levels);

router.post('/messages/reply',passport.authenticate('bearer', { session: false }),messageController.reply);

router.get('/messages',passport.authenticate('bearer', { session: false }),messageController.list);

router.get('/messages/unreadCount',passport.authenticate('bearer', { session: false }),messageController.unread);

router.post('/messages/markAllRead',passport.authenticate('bearer', { session: false }),messageController.markall);

router.get('/districts', passport.authenticate('bearer', {session: false}), districtController.getDistricts);

router.get('/districts/towns', passport.authenticate('bearer', {session: false}), districtController.getTowns);

router.get('/contacts/area', passport.authenticate('bearer', {session: false}), userController.getUsersByArea);

//router.get('/contacts/name', passport.authenticate('bearer', {session: false}), userController.getUsersByName);

router.get('/contacts/search', passport.authenticate('bearer', {session: false}), userController.searchUsersByName);

router.get('/contacts/:id', passport.authenticate('bearer', {session: false}), userController.getUserById);

//router.get('/contents',  passport.authenticate('bearer', {session: false}), contentController.getContents);

//router.get('/contents/category', passport.authenticate('bearer', {session: false}), contentController.getContentsByCategory);

router.get('/contents', passport.authenticate('bearer', {session: false}), contentController.list);

router.get('/contents/subcategory', passport.authenticate('bearer', {session: false}), contentController.getContentsBySubcategory);

router.get('/contents/:id', passport.authenticate('bearer', {session: false}), contentController.getContentsById);

// router.post('/posts/:id/likes',passport.authenticate('bearer', { session: false }),postController.like);

// router.delete('/posts/:id/likes',passport.authenticate('bearer', { session: false }),postController.unlike);


module.exports = router;
