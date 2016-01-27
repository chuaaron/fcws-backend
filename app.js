var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    config = require('./config/config.js'),
    passport = require('passport'),
    apiRouterV1 = require('./api_router_v1'),
    webRouter = require('./web_router'),
    flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(cors());

//app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('express-session')({
    secret: config.sessionSecret,// 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 30 * 60 *60 * 1000 },
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(function (req,res,next) {
    //console.log("app.usr local");
    //res.locals.user = req.session.user;

    //var signupError = req.flash('signupError');
    //res.locals.signupError = signupError.length ? signupError: null;

    var err = req.flash('error');
    res.locals.error = err.length ? err: null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;

    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', apiRouterV1);
app.use('/',webRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(req);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
