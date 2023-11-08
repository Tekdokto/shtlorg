var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cors = require('cors');
var session = require('express-session');
var dbConfig = require('./config/db.js');

var http = require('http');

var lang = require('./config/configi18n');



/*App port declaration */
const port = process.env.PORT || 5081;
var app = express();
var mysql = require('mysql');
var connection = require('express-myconnection');
/* Express Messages Middleware */
app.use(flash());
app.use(cors());

/* view engine setup */
// app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Set Public Folder */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(logger('dev'));

/* Body Parser Middleware */
app.use(cookieParser()); // read cookies (needed for auth)

/* parse application/json */
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Express Session Middleware */
app.use(session({
    secret: 'Dr~jdprTsdf44',
    resave: true,
    saveUninitialized: true
}));

/* error handler */
app.use(function (err, req, res, next) {
    /* set locals, only providing error in development */
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'devlopment' ? err : {};

    /* render the error page */
    res.status(err.status || 500);
    res.render('error');
});

/* flash error and success mssages */
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    // res.locals.error_messages = require('express-messages')(req, res);
    res.locals.error_messages = req.flash('error_messages');
    next();
});

/* Language Setup */
app.use(function (req, res, next) {
    // mustache helper
    res.locals.__ = function (text) {
        if (req.cookies.lang != "undefined" && req.cookies.lang) {
            lang.i18n.setLocale(req.cookies.lang);
        } else {
            lang.i18n.setLocale('en');
        }
        // var x = lang.i18n.__(text);
        return lang.i18n.__(text);
    };
    next();
});




app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

/* sql connection */
app.use(connection(mysql, dbConfig));


// Cron files
app.use('/', require('./routes/cron'));


app.use('/', require('./routes/api/admin/user'),function (err, req, res, next) {
    console.log("err",err)
    res.json({status: false,message: "Oops! Something went wrong"});
});

app.use('/', require('./routes/api/admin/category'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/', require('./routes/api/admin/cms'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/', require('./routes/api/admin/video'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/', require('./routes/api/admin/mockinterview'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/admin', require('./routes/api/admin/master'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/student', require('./routes/api/student/master'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});

app.use('/', require('./routes/api/student/user'),function (err, req, res, next) {
    console.log("err in front user routes :", err);
    res.json({status: false,message: "Oops! Something went wrong"});
});

app.use('/', require('./routes/api/student/auth'),function (err,req, res, next) {
    console.log("err",err)
    res.json({status: false,message: "Oops! Something went wrong111"});
}); 
app.use('/', require('./routes/api/student/videouser'),function (err,req, res, next) {
    console.log("err",err)
    res.json({status: false,message: "Oops! Something went wrong111"});
}); 
app.use('/', require('./routes/api/student/userskill'),function (err,req, res, next) {
    console.log("err",err)
    res.json({status: false,message: "Oops! Something went wrong111"});
}); 

app.use('/', require('./routes/users'),function (err, req, res, next) {
    console.log("err in user routes :", err);
    res.json({status: 0,message: "Oops! Something went wrong"});
});

app.use('/company', require('./routes/api/company/student'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/company', require('./routes/api/company/watchlist'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
app.use('/company', require('./routes/api/company/user'),function (err, req, res, next) {
    res.json({status: false,message: "Oops! Something went wrong"});
});
/* Initialize server */
var server = http.createServer(app);

/* Start Server */
server.listen(port, function () {
    console.log('HTTP server listening on port ' + port);
});


module.exports = app;
