var passport = require('passport'),
    mongoose = require('mongoose'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    User = mongoose.model('User');

module.exports = function() {
    //要使用该模块，url中的token的名称必须为access_token,并将user数据放到req.user中
    passport.use(new BearerStrategy(
        function(token, done) {
            User.findOne({ accessToken: token}, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'all' });
            });
        }
    ));
};


