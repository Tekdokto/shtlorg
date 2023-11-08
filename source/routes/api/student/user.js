var express = require('express');
var router = express.Router();
var hash = require('../../../pass').hash;
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var msg = require('../../../config/messages');
var func = require('../../../config/functions');
var functions = func.func();
var messages = msg.messages;
var async = require('async');
var thumb = require('node-thumbnail').thumb;
var auth_service = require('../../../services/auth');
var generalfunction = require('../../../services/general');
var general = generalfunction.func();
var eml = require('../../../services/email');
var emailservice = eml.func();
const constants = require('../../../config/constants');
var locale = require('../../../config/configi18n');
var jwt = require('jsonwebtoken');
const io = require('socket.io')();
var moment = require('moment');
var momentzone = require('moment-timezone');
var passport = require("passport");
var request = require("request");
require("../passport")();
var fs = require('fs.extra');

var lodash = require('lodash');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'+file.fieldname)
    },
    filename: function (req, file, cb) {
        var getFileExt = function (fileName) {
            var fileExt = fileName.split(".");
            if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
                return "";
            }
            return fileExt.pop();
        }
        var microsecond = Math.round(new Date().getTime() / 1000 * Math.floor(Math.random() * 1000000000)); //new Date().getTime();
        if(file.fieldname === "resume" || file.fieldname === "certification") {            
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + microsecond + path.extname(file.originalname)); // Date.now() + '.' + getFileExt(file.originalname))
        } else {
            cb(null, microsecond + path.extname(file.originalname)); // Date.now() + '.' + getFileExt(file.originalname))
        }
    }
});
var multerUpload = multer({ storage: storage });

var response = {};
var upload = multer();

router.use(function (req, res, next) {
    console.log("middleware");
    next();
})

//this api for fontend twiter token check
router.route('/student/reverse').post(function (req, res, next) {
    console.log("request req.query1",req.query,req.body)
   
    request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
            oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
            consumer_key: constants.TWITTER_CONSUMER_API_KEY,
            consumer_secret: constants.TWITTER_CONSUMER_API_SECRET_KEY
        }
    }, function (err, r, body) {
        if (err) {
            return res.send(500, { message: e.message });
        }
        console.log("testesteests")
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
    });
});
//this api for frontend twiter login
router.route('/student/twitteradmin').post((req, res, next) => {
   
    
    console.log("request header1",req.headers.role);
    request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
            consumer_key: constants.TWITTER_CONSUMER_API_KEY,
            consumer_secret: constants.TWITTER_CONSUMER_API_SECRET_KEY,
            token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, res, body) {
        if (err) {
            return res.send(500, { message: err.message });
        }
        
        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);
        console.log("twitterlogin1111",parsedBody)
        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;
        req.body['role'] = req.headers.role;
      
       
        console.log("twitterlogin222-req.body",req.body)
        next();
        
    });
}, passport.authenticate('twitter-token', { session: false }), function (req, res, next) {
    if (!req.user) {
        return res.json({ status: 0, message: "User not authenticated" });
    }
    console.log("-req.body",req.body)
    twitter_login(req, res, next, req.user);
    
});

/**
 * SSO signup
 * strategy values => normal, facebook, google, twitter, apple
 * Require fields - Normal signup
 *  - first_name
 *  - last_name
 *  - email
 *  - password
 *  - strategy
 * Require fields - social login
 *  - access_token
 *  - strategy
 * ALTER TABLE `user` ADD `twitter_id` VARCHAR(255) NULL DEFAULT NULL AFTER `google_id`;
 * ALTER TABLE `user` ADD `apple_id` VARCHAR(255) NULL DEFAULT NULL AFTER `twitter_id`;
 */
router.post("/student/sso",upload.array(), function (req, res, next) {
    var post = { ...req.body };
    var strategies = ["facebook", "google", "twitter", "apple"]
    var roles = [1,2] //1= admin,2=student
    console.log("post :", post);
    if (post.strategy == "normal") {
        normal_signup(req, res, next);
    } else if(strategies.includes(post.strategy) && roles.includes(post.role)) {
        var elem = functions.validateReqParam(post, ["access_token",'role']);
        var valid = elem.missing.length == 0 && elem.blank.length == 0;
        if (!valid) {
            var str = functions.loadErrorTemplate(elem);
            response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
            return res.json(response);
        }
        
        if(post.strategy== "facebook") {
            passport.authenticate("facebook-token", function (err, user, info) {
                if (err) return res.json({ status: false, message: "Something went wrong" })
                facebook_login(req, res, next, user);
            })(req, res, next)

        } else if (post.strategy == "google") {
            console.log("test")
            passport.authenticate("google-token", function (err, user, info) {
                if (err) return res.json({ status: false, message: "Something went wrong" })
                google_login(req, res, next, user);
            })(req, res, next)

        } else if (post.strategy == "twitter") {
            passport.authenticate("twitter-token", function (err, user, info) {
                if (err) return res.json({ status: false, message: "Something went wrong" })
                twitter_login(req, res, next, user);
            })(req, res, next)
        } else if (post.strategy == "apple") {
            passport.authenticate("apple", function (err, user, info) {
                if (err) return res.json({ status: false, message: "Something went wrong" })
                apple_login(req, res, next, user);
            })(req, res, next)
        }
    } else {
        return res.json({ status: false, message: "please specify valid strategy" })
    }
})

function twitter_login(req, res, next, user_data) {
    console.log("req.query in twitter:::::",req.body)
    var post = { ...req.body };
    if (!user_data) {
        response = general.response_format(false, '"User not authenticated', {});
        res.send(response);
    }else{
        console.log("requser",user_data)
        var profile = user_data;
        var email = profile.emails[0].value
        var fid = profile.id
        var first_name= profile.name.givenName
        var last_name= profile.name.familyName
        var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("user_data",email,fid,first_name,last_name)
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = `SELECT * from user where email = '${email}' AND status != 2 AND role_id = ${post.role} `;
                                    
                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err",err);
                        response = general.response_format(false, messages.OOPS, {},connection,post,"front/auth/twitter",'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {
                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {},connection,post,"front/auth/facebook",'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {},connection,post,"front/auth/facebook",'account is deleted');
                            res.send(response);
                        } else {

                            connection.query("UPDATE user SET twitter_id = '" + fid + "',auth_token_verify_time = '" + created_date + "' WHERE id = '" + result[0].id + "'", function (err, data) {
                                if (err) {
                                    console.log("eror",err)
                                    response = general.response_format(false, messages.OOPS, {},connection,post,"front/auth/twitter",'update query error');
                                    res.json(response);
                                } else {
                                    let jwtData;

                                    var user = { user_id: result[0].id };
                                    general.get_user_structure_data(req, user, function (result) {
                                        jwtData = result.data;
                                            
                                            var data = {
                                                user_id: result.data.user_id
                                            };
                                            const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                expiresIn: 86400 // 1 day
                                            });
                                            response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                            response.token = token;
                                            res.send(response);
                                    });
                                }
                            })
                        }

                    }else{

                        //if not exist then add new row with all data and login user response

                        var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                        var sql = `INSERT INTO user (first_name,last_name,email,twitter_id,password,auth_key,is_verified,email_verify_time,role_id,created_date) VALUES ?`;
                        var values = [
                            [
                                [first_name,last_name,email,fid,'',user_verifytoken,1,created_date,post.role,created_date]
                            ]
                        ];
                        connection.query(sql,values, function (err, rowsdata) {
                            if (err) {
                                console.log(err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/twitter", 'Mysql error in create user query');
                                res.send(response);
                            }  else {
                                var user_id = rowsdata.insertId;
                                var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
                                connection.query(sql, function (err, email_template) {
                                    if (err) {
                                        response = general.response_format(false, messages.ERROR_PROCESSING, {},connection,post,"front/auth/twitter",'email_template err');
                                        res.send(response);
                                    } else {
                                        
                                        var html = email_template[0].emailtemplate_body;
                                        var html = html.replace(/{link}/gi, constants.APP_URL + "auth/emailverify/" + user_verifytoken + " ");
                                        var data = { to: email, subject: email_template[0].emailtemplate_subject, html: html };
                                        console.log("mail call")
                                        emailservice.sendMailnew(req, data, function (result) {
                                            console.log("result",result)
                                        });

                                        let jwtData;

                                        var user = { user_id: user_id };
                                        general.get_user_structure_data(req, user, function (result) {
                                            jwtData = result.data;
                                                
                                                var data = {
                                                    user_id: result.data.user_id
                                                };
                                                const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                    expiresIn: 86400 // 1 day
                                                });
                                                response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                                response.token = token;
                                                res.send(response);
                                        });
                                    
                                    }
                                });
                            }
                        })
                    }
                })

            }
        })
    }
}

function google_login(req, res, next, user_data) {
    var post = { ...req.body };
    if (!user_data) {
       
        response = general.response_format(false, '"User not authenticated', {});
        res.send(response);
    }else{
        console.log("requser",user_data)
        var profile = user_data;
        var email = profile.emails[0].value
        var fid = profile.id
        var first_name= profile.name.givenName
        var last_name= profile.name.familyName
        var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("user_data",email,fid,first_name,last_name)
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = `SELECT * from user where email = '${email}' AND status != 2 AND role_id = ${post.role} `;
                                    
                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err",err);
                        response = general.response_format(false, messages.OOPS, {},connection,post,"front/auth/facebook",'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {
                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {},connection,post,"front/auth/facebook",'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {},connection,post,"front/auth/facebook",'account is deleted');
                            res.send(response);
                        } else {

                            connection.query("UPDATE user SET google_id = '" + fid + "',auth_token_verify_time = '" + created_date + "' WHERE id = '" + result[0].id + "'", function (err, data) {
                                if (err) {
                                    console.log("eror",err)
                                    response = general.response_format(false, messages.OOPS, {},connection,post,"front/auth/facebook",'update query error');
                                    res.json(response);
                                } else {
                                    let jwtData;

                                    var user = { user_id: result[0].id };
                                    general.get_user_structure_data(req, user, function (result) {
                                        jwtData = result.data;
                                            
                                            var data = {
                                                user_id: result.data.user_id
                                            };
                                            const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                expiresIn: 86400 // 1 day
                                            });
                                            response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                            response.token = token;
                                            res.send(response);
                                    });
                                }
                            })
                        }

                    }else{

                        //if not exist then add new row with all data and login user response

                        var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                        var sql = `INSERT INTO user (first_name,last_name,email,google_id,password,auth_key,is_verified,email_verify_time,role_id,created_date) VALUES ?`;
                        var values = [
                            [
                                [first_name,last_name,email,fid,'',user_verifytoken,1,created_date,post.role,created_date]
                            ]
                        ];
                        connection.query(sql,values, function (err, rowsdata) {
                            if (err) {
                                console.log(err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'Mysql error in create user query');
                                res.send(response);
                            }  else {
                                var user_id = rowsdata.insertId;
                                var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
                                connection.query(sql, function (err, email_template) {
                                    if (err) {
                                        response = general.response_format(false, messages.ERROR_PROCESSING, {},connection,post,"front/auth/facebook",'email_template err');
                                        res.send(response);
                                    } else {
                                        
                                        var html = email_template[0].emailtemplate_body;
                                        var html = html.replace(/{link}/gi, constants.APP_URL + "emailverify/" + user_verifytoken + " ");
                                        var data = { to: email, subject: email_template[0].emailtemplate_subject, html: html };
                                        console.log("mail call")
                                        emailservice.sendMailnew(req, data, function (result) {
                                            console.log("result",result)
                                        });

                                        let jwtData;

                                        var user = { user_id: user_id };
                                        general.get_user_structure_data(req, user, function (result) {
                                            jwtData = result.data;
                                                
                                                var data = {
                                                    user_id: result.data.user_id
                                                };
                                                const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                    expiresIn: 86400 // 1 day
                                                });
                                                response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                                response.token = token;
                                                res.send(response);
                                        });
                                    
                                    }
                                });
                            }
                        })
                    }
                })

            }
        })
    }
}

function facebook_login(req, res, next, user_data) {
    console.log("req.query in facebook:::::",req.body)
    var post = { ...req.body };
    if (!user_data) {
        response = general.response_format(false, '"User not authenticated', {});
        res.send(response);
    } else {
        var profile = user_data;
        var email = profile.emails[0].value
        var fid = profile.id
        var first_name = profile.name.givenName
        var last_name = profile.name.familyName
        var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("user_data", email, fid, first_name, last_name)

        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = `SELECT * from user where email = '${email}' AND status != 2 AND role_id = ${post.role} `;

                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {
                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {}, connection, post, "front/auth/facebook", 'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {}, connection, post, "front/auth/facebook", 'account is deleted');
                            res.send(response);
                        } else {

                            connection.query("UPDATE user SET facebook_id = '" + fid + "', auth_token_verify_time = '" + created_date + "' WHERE id = '" + result[0].id + "'", function (err, data) {
                                if (err) {
                                    console.log("eror", err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'update query error');
                                    res.json(response);
                                } else {
                                    let jwtData;

                                    var user = { user_id: result[0].id };
                                    general.get_user_structure_data(req, user, function (result) {
                                        jwtData = result.data;

                                        var data = {
                                            user_id: result.data.user_id
                                        };
                                        const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                            expiresIn: 86400 // 1 day
                                        });
                                        response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                        response.token = token;
                                        res.send(response);
                                    });
                                }
                            })
                        }

                    } else {

                        //if not exist then add new row with all data and login user response

                        var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                        var sql = `INSERT INTO user (first_name,last_name,email,facebook_id,password,auth_key,is_verified,email_verify_time,role_id,created_date) VALUES ?`;
                        var values = [
                            [
                                [first_name, last_name, email, fid, '', user_verifytoken, 1, created_date, post.role, created_date]
                            ]
                        ];
                        connection.query(sql, values, function (err, rowsdata) {
                            if (err) {
                                console.log(err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'Mysql error in create user query');
                                res.send(response);
                            } else {
                                var user_id = rowsdata.insertId;
                                var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
                                connection.query(sql, function (err, email_template) {
                                    if (err) {
                                        response = general.response_format(false, messages.ERROR_PROCESSING, {}, connection, post, "front/auth/facebook", 'email_template err');
                                        res.send(response);
                                    } else {

                                        var html = email_template[0].emailtemplate_body;
                                        var html = html.replace(/{link}/gi, constants.APP_URL + "emailverify/" + user_verifytoken + " ");
                                        var data = { to: email, subject: email_template[0].emailtemplate_subject, html: html };
                                        console.log("mail call")
                                        emailservice.sendMailnew(req, data, function (result) {
                                            console.log("result", result)
                                        });

                                        let jwtData;

                                        var user = { user_id: user_id };
                                        general.get_user_structure_data(req, user, function (result) {
                                            jwtData = result.data;

                                            var data = {
                                                user_id: result.data.user_id
                                            };
                                            const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                expiresIn: 86400 // 1 day
                                            });
                                            response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                            response.token = token;
                                            res.send(response);
                                        });

                                    }
                                });
                            }
                        })
                    }
                })

            }
        })
    }
}
function apple_login(req, res, next, user_data) {
    console.log("req.query in apple:::::",req.body)
    var post = { ...req.body };
    if (!user_data) {
        response = general.response_format(false, '"User not authenticated', {});
        res.send(response);
    } else {
        var profile = user_data;
        var email = profile.emails[0].value
        var fid = profile.id
        var first_name = profile.name.givenName
        var last_name = profile.name.familyName
        var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("user_data", email, fid, first_name, last_name)

        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = `SELECT * from user where email = '${email}' AND status != 2 AND role_id = ${post.role} `;

                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {
                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {}, connection, post, "front/auth/facebook", 'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {}, connection, post, "front/auth/facebook", 'account is deleted');
                            res.send(response);
                        } else {

                            connection.query("UPDATE user SET apple_id = '" + fid + "', auth_token_verify_time = '" + created_date + "' WHERE id = '" + result[0].id + "'", function (err, data) {
                                if (err) {
                                    console.log("eror", err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'update query error');
                                    res.json(response);
                                } else {
                                    let jwtData;

                                    var user = { user_id: result[0].id };
                                    general.get_user_structure_data(req, user, function (result) {
                                        jwtData = result.data;

                                        var data = {
                                            user_id: result.data.user_id
                                        };
                                        const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                            expiresIn: 86400 // 1 day
                                        });
                                        response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                        response.token = token;
                                        res.send(response);
                                    });
                                }
                            })
                        }

                    } else {

                        //if not exist then add new row with all data and login user response

                        var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                        var sql = `INSERT INTO user (first_name,last_name,email,apple_id,password,auth_key,is_verified,email_verify_time,role_id,created_date) VALUES ?`;
                        var values = [
                            [
                                [first_name, last_name, email, fid, '', user_verifytoken, 1, created_date, post.role, created_date]
                            ]
                        ];
                        connection.query(sql, values, function (err, rowsdata) {
                            if (err) {
                                console.log(err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/auth/facebook", 'Mysql error in create user query');
                                res.send(response);
                            } else {
                                var user_id = rowsdata.insertId;
                                var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
                                connection.query(sql, function (err, email_template) {
                                    if (err) {
                                        response = general.response_format(false, messages.ERROR_PROCESSING, {}, connection, post, "front/auth/facebook", 'email_template err');
                                        res.send(response);
                                    } else {

                                        var html = email_template[0].emailtemplate_body;
                                        var html = html.replace(/{link}/gi, constants.APP_URL + "emailverify/" + user_verifytoken + " ");
                                        var data = { to: email, subject: email_template[0].emailtemplate_subject, html: html };
                                        console.log("mail call")
                                        emailservice.sendMailnew(req, data, function (result) {
                                            console.log("result", result)
                                        });

                                        let jwtData;

                                        var user = { user_id: user_id };
                                        general.get_user_structure_data(req, user, function (result) {
                                            jwtData = result.data;

                                            var data = {
                                                user_id: result.data.user_id
                                            };
                                            const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                expiresIn: 86400 // 1 day
                                            });
                                            response = general.response_format(true, messages.SUCCESS, result.data, connection, user_data, "front/auth/facebook", "user login successfully");
                                            response.token = token;
                                            res.send(response);
                                        });

                                    }
                                });
                            }
                        })
                    }
                })

            }
        })
    }
}


function normal_signup(req, res, next) {
    var post = req.body;
    var required_params = ['full_name', 'career_path_id', 'email', 'password', 'racial_identity'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    
    var fullnamedata = post.full_name.trim()
    var arrname = fullnamedata.split(/ (.*)/);
    
    if (valid) {
        let first_name = arrname[0]
        let last_name = (arrname.length >= 2)?arrname[1]:""
        
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "student/adduser", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkemailq = "SELECT * FROM user WHERE email = '" + post.email + "' AND status!='2' ";
                connection.query(checkemailq, function (err, checkemail) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (checkemail.length > 0) {
                            var msg = "Email already exist";
                            response = general.response_format(false, msg, {}, connection, post, "student/adduser", msg);
                            res.send(response);
                        } else {

                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/adduser", 'error in genSalt');
                                    res.send(response);
                                } else {
                                    bcrypt.hash(post.password, salt, function (err, hash) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/adduser", 'error in hash');
                                            res.send(response);
                                        } else {
                                            var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                            var sql = `INSERT INTO user (full_name,first_name,last_name,career_path_id,racial_identity,email,password,auth_key,is_verified,email_verify_time,is_password_changed,role_id,looking_for_job,created_date) VALUES ?`;
                                            var values = [
                                                [
                                                    [post.full_name,first_name,last_name, post.career_path_id, post.racial_identity, post.email, hash, user_verifytoken, 0, created_date,constants.IS_PASSWORD_CHANGED, 2,1,created_date]
                                                ]
                                            ];
                                            connection.query(sql, values, function (err, rowsdata) {
                                                if (err) {
                                                    console.log(err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/adduser", 'Mysql error in create user query');
                                                    res.send(response);
                                                } else {
                                                    var user_id = rowsdata.insertId;
                                                    var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.ERROR_PROCESSING, {}, connection, post, "student/signup", 'email_template err');
                                                            res.send(response);
                                                        } else {
                                                            var career_path_listing_query = `SELECT * FROM skills WHERE career_path_id='${post.career_path_id}' and is_default_skill='1'`;
                                                            connection.query(career_path_listing_query,(err,skills)=>{
                                                                if(err){
                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/adduser", 'Mysql error in select default skill query');
                                                                    res.send(response);
                                                                }else{
                                                                    let default_skill_id = 0; 
                                                                    console.log("Skills",skills);
                                                                    
                                                                    if(skills.length > 0){
                                                                        default_skill_id = skills[0].id;
                                                                        is_default = skills[0].is_default_skill
                                                                    }
                                                                    let created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                                                    connection.query(`INSERT INTO student_skill(user_id,skill_id,is_default_skill,skill_exam_status,created_date) VALUES ('${user_id}','${default_skill_id}','${is_default}','0','${created_date}')`,(err,insertedSkill)=>{
                                                                        if(err){
                                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/adduser", 'Mysql error in insert default skill  query');
                                                                            res.send(response);
                                                                        }else{
                                                                        var html = email_template[0].emailtemplate_body;
                                                                        var html = html.replace(/{first_name}/gi, (first_name) ? first_name : '');
                                                                        var html = html.replace(/{last_name}/gi, (last_name) ? last_name : '');
                                                                        var html = html.replace(/{useremail}/gi, (post.email) ? post.email : '');
                                                                        var html = html.replace(/{link}/gi, constants.APP_URL + "confirm/emailverify/" + user_verifytoken + " ");
                                                                        var data = { to: post.email, subject: email_template[0].emailtemplate_subject, html: html };
                                                                        console.log("mail call")
                                                                        emailservice.sendMailnew(req, data, function (result) {
                                                                            console.log("result", result)
                                                                        });

                                                                        let jwtData;

                                                                        var user = { user_id: user_id };
                                                                        general.get_user_structure_data(req, user, function (result) {
                                                                            jwtData = result.data;

                                                                            var data = {
                                                                                user_id: result.data.user_id
                                                                            };
                                                                            response = general.response_format(true, messages.PROFILE_CREATED, result.data, connection, post, "student/adduser", "user registered successfully");

                                                                            res.send(response);
                                                                        });
                                                                        }
                                                                    })                                                                    
                                                                }
                                                            })
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                        }
                    }
                })
            }
        });
    } else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);
    }
}

router.post('/student/login', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {
    let response = {};
    var post = req.body;
    console.log("#", post);
    var ipaddress = '';
    var state = '';
    var country = '';
    var todaysdate = moment(new Date()).utc().format('YYYY-MM-DD');
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var login_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['email', 'password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {

        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = `SELECT * from user where email = '${post.email}' AND status != 2 AND role_id = 2 `;

                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/login", 'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {

                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {}, connection, post, "student/login", 'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {}, connection, post, "student/login", 'account is deleted');
                            res.send(response);
                        } else {
                            if(result[0].is_verified == 1){
                                bcrypt.compare(post.password, result[0].password, (err, db_res) => {
                                    if (db_res) {                    
                                        let jwtData;
                                        var user = { user_id: result[0].id };
                                        general.get_user_structure_data(req, user, function (result) {
                                            if (result.status == 1) {
                                                console.log("#user pic", user, result);
                                                jwtData = result.data;
                                                const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                    expiresIn: 86400 // 1 day
                                                });
                                                var data = {
                                                    user_id: result.data.user_id
                                                };
                                                var sql = "UPDATE user SET last_login_date = ? WHERE id  = ?";
                                                connection.query(sql, [login_date, result.data.user_id], function (err, updatedrows) {
                                                    response = general.response_format(true, 'User Login Successfully', result.data, connection, post, "student/login", 'User Login Successfully');
                                                    response.token = token;
                                                    res.send(response);
                                                });
                                            }
                                            else {
                                                //  res.send(result);
                                                response = general.response_format(false, result.message, {}, connection, post, "student/login", 'result.status !=1');
                                                res.send(response);
                                            }
                                        });                                        
                                    } else {
                                        response = general.response_format(false, messages.PASSWORD_DOES_NOT_MATCH, {});
                                        res.send(response);
                                    }
                                })
                            }else{
                                let verified_count = result[0].verified_count;
                                if(verified_count < 2) {
                                    bcrypt.compare(post.password, result[0].password, (err, db_res) => {
                                        if (db_res) {                    
                                            let jwtData;
                                            var user = { user_id: result[0].id };
                                            general.get_user_structure_data(req, user, function (result) {
                                                if (result.status == 1) {
                                                    console.log("#user pic", user, result);
                                                    jwtData = result.data;
                                                    const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                        expiresIn: 86400 // 1 day
                                                    });
                                                    var data = {
                                                        user_id: result.data.user_id
                                                    };
                                                    var sql = "UPDATE user SET verified_count = ?, last_login_date = ? WHERE id  = ?";
                                                    connection.query(sql, [verified_count+1, login_date, result.data.user_id], function (err, updatedrows) {
                                                        response = general.response_format(true, 'User Login Successfully', result.data, connection, post, "student/login", 'User Login Successfully');
                                                        response.token = token;
                                                        res.send(response);
                                                    });                                                    
                                                }
                                                else {
                                                    //  res.send(result);
                                                    response = general.response_format(false, result.message, {}, connection, post, "student/login", 'result.status !=1');
                                                    res.send(response);
                                                }
                                            });                                        
                                        } else {
                                            response = general.response_format(false, messages.PASSWORD_DOES_NOT_MATCH, {});
                                            res.send(response);
                                        }
                                    })
                                } else {
                                    var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                    let last_updated_date = (result[0].email_verify_time)?result[0].email_verify_time:((result[0].created_date)?result[0].created_date:currenttime)
                                    
                                    var resettime = moment(last_updated_date).format('YYYY-MM-DD HH:mm:ss');
                                    var diff = moment.duration(moment(currenttime).diff(moment(resettime))).asMinutes();
                                    console.log("Result :",last_updated_date,diff)
                                    // Resend the email for verify
                                    if(diff > 1440){
                                        var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                        var sql = "UPDATE `user` SET auth_key=?,email_verify_time=? WHERE id = ?";
                                        var values = [user_verifytoken,currenttime, result[0].id];
                                        connection.query(sql,values,()=>{
                                            var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 3; ";
                                            connection.query(sql, function (err, email_template) {
                                                if (err) {
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/login", 'email_template err');
                                                    res.send(response);
                                                } else {
                                                    var html = email_template[0].emailtemplate_body;
                                                    var html = html.replace(/{first_name}/gi, (result[0].first_name) ? result[0].first_name : '');
                                                    var html = html.replace(/{last_name}/gi, (result[0].last_name) ? result[0].last_name : '');
                                                    
                                                    var html = html.replace(/{link}/gi, constants.APP_URL + "confirm/emailverify/" + user_verifytoken + " ");
                                                    var data = { to: result[0].email, subject: email_template[0].emailtemplate_subject, html: html };
                                                    console.log("mail call")
                                                    emailservice.sendMailnew(req, data, function (result1) {
                                                        console.log("result", result1)
                                                    });
                                                    response = general.response_format(false, 'Email verify link sent.Please verify and try again!', {}, connection, post, "student/login", 'Email verify link sent.Please verify and try again!');
                                                    res.send(response);                                                                                                                                  
                                                }
                                            });
                                        })  
                                        
                                    }else{
                                        response = general.response_format(false, 'Email is not verified! Please verify your email to login', {}, connection, post, "student/login", 'Email is not verified! Please verify your email to login');
                                        res.send(response);
                                    }
                                }
                            }                            
                        }
                    } else {
                        //if email not exist
                        console.log(result)
                        response = general.response_format(false, "Email address is not registered", {}, connection, post, "student/login", 'email address not registered');
                        res.send(response);
                    }
                })

            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);
        res.send(response);
    }
})

//api for change password
router.post('/student/changepassword', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, function (req, res, next) {
    var post = req.body;
    response = {};
    console.log('change password:', post);

    var required_params = ['password', 'currentpassword', 'user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var newpassword = post.password;
        var currentpassword = post.currentpassword;
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.json(response);
            } else {
                connection.query("SELECT * FROM user WHERE id='" + post.user_id + "' AND status = 1 AND role_id = '2'", function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/changepassword", 'error in select query');
                        res.json(response);
                        // res.json({ "status": 0, "message": messages.OOPS });
                    } else {
                        if (rows.length > 0) {
                            var password_hash = rows[0].password;
                            var user_id = rows[0].user_id;
                            // Load hash from your password DB.
                            bcrypt.compare(currentpassword, password_hash, function (err, result) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/changepassword", 'error in bcrypt compare');
                                    res.json(response);
                                } else {
                                    if (result == true) {
                                        bcrypt.genSalt(10, function (err, salt) {
                                            if (err) {

                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/changepassword", 'error in bcrypt salt');
                                                res.json(response);
                                            } else {
                                                bcrypt.hash(newpassword, salt, function (err, hash) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/changepassword", 'error in bcrypt hash');
                                                        res.json(response);
                                                    } else {
                                                        connection.query("UPDATE user SET password = '" + hash + "', is_password_changed='1' WHERE id = '" + post.user_id + "'", function (err, data) {
                                                            if (err) {
                                                                console.log("eror", err)
                                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/changepassword", 'error in update query');
                                                                res.json(response);
                                                            } else {
                                                                console.log("UPDAFE", err, data)
                                                                if (data.affectedRows > 0) {
                                                                    console.log("IN IF")
                                                                    response = general.response_format(true, messages.PASSWORD_UPDATED, {}, connection, post, "student/changepassword", 'Password changed successfully');
                                                                    res.json(response);
                                                                } else {
                                                                    console.log("IN ELSE");
                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/changepassword", 'update query not affected');
                                                                    res.json(response);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        response = general.response_format(false, messages.WRONG_CURRENT_PASSSWORD, {}, connection, post, "student/changepassword", 'error in select query');
                                        res.json(response);
                                    }
                                }
                            })
                        } else {
                            res.json({
                                status: 0,
                                message: messages.USER_NOT_FOUND
                            })
                        }
                    }
                })
            }
        });
    } else {
        var str = functions.loadErrorTemplate(elem);
        response.status = 0;
        response.message = messages.WRONG_MISSING_PARAM + str;
        res.send(response);
    }
});
//API for forgot password and send link too user
//this api for front user forgot password
router.post('/student/forgotpassword', multerUpload.fields([{ 'name': 'profile_pic' }]), function (req, res, next) {
    var post = req.body;

    response = {};
    var required_params = ['email'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var username = post.email;

        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {

                var check_sql = "SELECT * FROM user  WHERE status =1  AND (email = ? ) AND role_id = 2 ";
                var check_values = [username];

                connection.query(check_sql, check_values, function (err, rows) {
                    if (err) {
                        response = general.response_format(false, err, {}, connection, post, "student/forgotpassword", 'User check email and status');
                        res.send(response);
                    }
                    else {
                        if (rows.length > 0) {
                            if (rows[0].status == 0) {
                                response = general.response_format(false, messages.INACTIVE_ACCOUNT, {}, connection, post, "student/forgotpassword", 'Account is deactivated');
                                res.send(response);
                            }
                            else {
                                var passwordResetToken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                var sql = "UPDATE `user` SET password_reset_token=?,password_reset_time=? WHERE id = ?";
                                var values = [passwordResetToken, moment().format('YYYY-MM-DD HH:mm:ss'), rows[0].id];
                                connection.query(sql, values, function (err, updateResetToken) {
                                    if (err) {
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/forgotpassword", 'Error in update forgot password token');
                                        res.send(response);
                                    }
                                    else {
                                        //email-start
                                        var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 1; ";
                                        connection.query(sql, function (err, email_template) {
                                            if (err) {

                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/forgotpassword", 'email_template err');
                                                res.send(response);
                                            } else {

                                                var html = email_template[0].emailtemplate_body;
                                                var html = html.replace(/{first_name}/gi, (rows[0].first_name) ? rows[0].first_name : '');
                                                var html = html.replace(/{last_name}/gi, (rows[0].last_name) ? rows[0].last_name : '');
                                                var html = html.replace(/{url}/gi, constants.APP_URL + "auth/resetpassword/" + passwordResetToken + " ");

                                                var data = { to: rows[0].email, subject: email_template[0].emailtemplate_subject, html: html };
                                                console.log("mail call", html)
                                                emailservice.sendMailnew(req, data, function (result) {
                                                    console.log("result", result)
                                                });
                                                response = general.response_format(true, 'Mail sent successfully', {}, connection, post, "student/forgotpassword", 'Mail sent successfully');
                                                res.send(response);

                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            response = general.response_format(false, messages.USER_NOT_FOUND, {}, connection, post, "student/forgotpassword", 'user not found');
                            res.send(response);
                        }
                    }
                });
            }
        });
    }
    else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.send(response);
    }
});

//API for verify user reset password token
router.post('/student/verifypasswordtoken', multerUpload.fields([{ 'name': 'profile_pic' }]), function (req, res) {
    var response = {};
    var post = req.body;
    console.log("reset passwrdddd", post)
    var required_params = ['token'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.json(response);
            } else {
                var sql = "SELECT * FROM user WHERE password_reset_token = ?";
                connection.query(sql, [post.token], function (err, rows) {
                    if (err) {

                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/verifypasswordtoken", 'error in select query');
                        res.json(response);
                    } else {
                        if (rows.length > 0) {
                            if (rows[0].status == 0) {
                                response = general.response_format(false, messages.INACTIVE_ACCOUNT, {}, connection, post, "front/student/forgotpassword", 'Account is deactivated');
                                res.send(response);
                            }
                            else {
                                if (rows[0].password_reset_time != null && rows[0].password_reset_time != "" && rows[0].password_reset_time != "null") {
                                    var currenttime = moment().format('YYYY-MM-DD HH:mm:ss');
                                    var resettime = moment(rows[0].password_reset_time).format('YYYY-MM-DD HH:mm:ss');
                                    console.log("reset time", resettime);
                                    var diff = moment.duration(moment(currenttime).diff(moment(resettime))).asMinutes();
                                    console.log("difff", diff);
                                    if (diff > 1440) {
                                        response = general.response_format(false, 'Link has been Expires.Please Try again!', {}, connection, post, "front/student/verifypasswordtoken", 'Link has been Expires');
                                        res.send(response);
                                    } else {
                                        response = general.response_format(true, messages.SUCCESS, {}, connection, post, "front/student/verifypasswordtoken", 'Success');
                                        res.send(response);
                                    }
                                } else {
                                    response = general.response_format(true, messages.SUCCESS, rows[0], connection, post, "front/student/verifypasswordtoken", 'Success');
                                    res.send(response);
                                }

                            }

                        } else {
                            response = general.response_format(false, "Link is not valid", {}, connection, post, "front/student/verifypasswordtoken", 'Link is not valid');
                            res.send(response);
                        }
                    }

                })

            }
        })
    } else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);
    }
})
//API for reset user password
router.post('/student/resetpassword', upload.array(), function (req, res) {
    var response = {};
    var post = req.body;
    var required_params = ['token', 'confirmpassword'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.json(response);
            } else {
                var sql = "SELECT * FROM user WHERE password_reset_token = ?";
                connection.query(sql, [post.token], function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/resetpassword", 'error in select query');
                        res.json(response);
                    } else {
                        if (rows.length > 0) {
                            if (rows[0].status == 0) {
                                response = general.response_format(false, messages.INACTIVE_ACCOUNT, {}, connection, post, "front/student/resetpassword", 'Account is deactivated');
                                res.send(response);
                            }
                            else {
                                bcrypt.genSalt(10, function (err, salt) {
                                    if (err) {
                                        response = general.response_format(false, err, {}, connection, post, "front/student/resetpassword", 'bcrypt.genSalt');
                                        res.send(response);
                                    }
                                    else {
                                        bcrypt.hash(post.confirmpassword, salt, function (err, hash) {
                                            if (err) {

                                                response = general.response_format(false, err, {}, connection, post, "front/student/resetpassword", 'bcrypt.hash');
                                                res.send(response);
                                            }
                                            else {
                                                var sql = "UPDATE `user` SET password=?,password_reset_token=?,password_reset_time  = ?,is_password_changed=?  WHERE id = ?";
                                                var values = [hash, "", moment().format('YYYY-MM-DD HH:mm:ss'),1, rows[0].id];
                                                connection.query(sql, values, function (err, data) {
                                                    if (err) {
                                                        response = general.response_format(false, err, {}, connection, post, "front/student/resetpassword", 'error in update password query');
                                                        res.send(response);
                                                    }
                                                    else {
                                                        response = general.response_format(true, messages.PASSWORD_UPDATED, {}, connection, post, "front/student/resetpassword", 'Password updated successfully');
                                                        res.send(response);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }


                        } else {
                            response = general.response_format(false, "Link is not valid", {}, connection, post, "front/student/resetpassword", 'Link is not valid');
                            res.send(response);
                        }
                    }
                });
            }
        });
    } else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);
    }
});


router.post('/student/emailverify', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['token'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                console.log("err1")
                var check_sql = "SELECT * FROM user WHERE is_verified = ? AND auth_key = ?";
                connection.query(check_sql, [1, post.token], function (err, checkrows) {
                    if (err) {
                        console.log("err1", err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/emailverify", 'Problem in select query');
                        res.send(response);
                    } else {
                        console.log(checkrows)
                        if (checkrows.length > 0) {
                            response = general.response_format(true, 'Your Email is already verified, no need to verify again.', {}, connection, post, "front/student/emailverify", 'Your Email is already verified, no need to verify again.');
                            res.send(response);
                        } else {
                            var sql = "SELECT * FROM user WHERE auth_key = ?";
                            connection.query(sql, [post.token], function (err, rows) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/emailverify", 'Problem in select query');
                                    res.send(response);
                                } else {
                                    if (rows.length > 0) {
                                        var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                        let last_updated_date = (rows[0].email_verify_time)?rows[0].email_verify_time:((rows[0].created_date)?rows[0].created_date:currenttime)
                                        
                                        var resettime = moment(last_updated_date).format('YYYY-MM-DD HH:mm:ss');
                                        var diff = moment.duration(moment(currenttime).diff(moment(resettime))).asMinutes();
                                        console.log("Result :",last_updated_date,diff)
                                        
                                        if(diff > 1440){
                                            response = general.response_format(false, 'Your email verification link has been expired', {}, connection, post, "front/student/emailverify", 'Link expired');
                                            res.send(response);
                                        }else{
                                            var sql = "UPDATE user SET is_verified = ? WHERE id  = ?";
                                            connection.query(sql, [1, rows[0].id], function (err, updatedrows) {

                                                if (err) {
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/emailverify", 'Problem in update query');
                                                    res.send(response);
                                                } else {
                                                    let jwtData;
                                                    var user = { user_id: rows[0].id };
                                                    general.get_user_structure_data(req, user, function (result) {
                                                        if (result.status == 1) {
                                                            console.log("#user pic", user, result);
                                                            jwtData = result.data;
                                                            const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                                expiresIn: 86400 // 1 day
                                                            });
                                                            var data = {
                                                                user_id: result.data.user_id
                                                            };
                                                            response = general.response_format(true, 'User Verified Successfully.', result.data, connection, post, "front/student/emailverify", 'User Verified Successfully.');
                                                            response.token = token;
                                                            res.send(response);                                                        
                                                        }
                                                        else {
                                                            //  res.send(result);
                                                            response = general.response_format(false, result.message, {}, connection, post, "front/student/emailverify", 'result.status !=1');
                                                            res.send(response);
                                                        }
                                                    });                                                
                                                }
                                            });
                                        }

                                        
                                    } else {
                                        response = general.response_format(false, 'Link is not valid', {}, connection, post, "front/student/emailverify", 'Link is not valid');
                                        res.send(response);
                                    }

                                }
                            })

                        }
                    }
                })
            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

//api for get user data
router.post('/student/getprofile', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = "SELECT * from user where id = ? ";
                let query_data = [post.user_id];
                connection.query(sql, query_data, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/getprofile", 'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        var user = { user_id: result[0].id };
                        general.get_user_structure_data(req, user, function (result) {
                            if (result.status == 1) {
                                console.log("#user pic", user, result);
                                var data = {
                                    user_id: result.data.user_id
                                };
                                response = general.response_format(true, 'Success', result.data, connection, post, "front/student/getprofile", 'Get user data');
                                res.send(response);

                            }
                            else {
                                //  res.send(result);
                                response = general.response_format(false, result.message, {}, connection, post, "front/student/getprofile", 'result.status !=1');
                                res.send(response);
                            }
                        });

                    } else {
                        //if email not exist
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/getprofile", 'User not found for user id');
                        res.send(response);
                    }
                })


            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})


//api for update user data
router.post('/student/updateprofile', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", req.files.profile_pic);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id', 'first_name', 'last_name', 'phone','looking_for_job', 'racial_identity'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var checkemailq = "SELECT * FROM user WHERE (phone = '" + post.phone + "') AND id != '" + post.user_id + "' AND status!='2' ";
                connection.query(checkemailq, function (err, checkemail) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (checkemail.length > 0) {
                            var msg = "Phone number already exist";
                            response = general.response_format(false, msg, {}, connection, post, "front/student/updateprofile", msg);
                            res.send(response);
                        } else {
                            let update_profile = "";
                            
                            if(req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename){
                                update_profile+=',profile_pic = ?'                     
                            }
                           
                            var sql = `UPDATE user SET first_name = ?,last_name = ?,address = ?, phone = ?,looking_for_job=?, racial_identity=?, modified_date = ? ${update_profile} WHERE id = ${post.user_id}`;
                            var values = [post.first_name, post.last_name, post.address, post.phone, post.looking_for_job, post.racial_identity, created_date]
                            if((req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename)||(post.remove_profile_pic && post.remove_profile_pic == 1)){
                                // console.log("FILE NAME:",req.files.profile_pic[0].filename)
                                if(post.remove_profile_pic && post.remove_profile_pic == 1){
                                    values.push("")
                                }else{
                                    console.log("#111", req.files.profile_pic[0].filename);
                                    values.push(req.files.profile_pic[0].filename)
                                }
                                
                            }
                            connection.query(sql, values, function (err, response) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in update query');
                                    res.send(response);
                                } else {
                                    response = general.response_format(true, messages.PROFILE_UPDATED, {}, connection, post, "front/student/updateprofile", 'profile update success');
                                    res.send(response);
                                }
                            })


                        }
                    }

                })


            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

//api for update user profile picture data
router.post('/student/updateprofilepic', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", req.files.profile_pic);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                //detail data
                var checkdetails = "SELECT * FROM user WHERE id = '" + post.user_id + "' ";
                connection.query(checkdetails, function (err, checkdetailsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofilepic", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        let update_profile = "";                
                        if(req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename){
                            update_profile+=',profile_pic = ?'                     
                        }
                        
                        var sql = `UPDATE user SET modified_date = ? ${update_profile} WHERE id = ${post.user_id}`;
                        var values = [created_date]
                        if((req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename)||(post.remove_profile_pic && post.remove_profile_pic == 1)){
                            // console.log("FILE NAME:",req.files.profile_pic[0].filename)
                            if(post.remove_profile_pic && post.remove_profile_pic == 1){
                                values.push("")
                            }else{
                                console.log("#111", req.files.profile_pic[0].filename);
                                values.push(req.files.profile_pic[0].filename)
                                general.remove_file(path.resolve(__dirname + "../../../../uploads/profile_pic/" + checkdetailsdata[0].profile_pic));
                            }
                            
                        }
                        connection.query(sql, values, function (err, response) {
                            if (err) {
                                console.log(err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofilepic", 'Mysql error in update query');
                                res.send(response);
                            } else {
                                response = general.response_format(true, messages.PROFILE_UPDATED, {}, connection, post, "front/student/updateprofilepic", 'profile update success');
                                res.send(response);
                            }
                        })
                    }
                })

            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

//Email tracking functionality
router.get('/student/trackemail', function (req, res) {
    var id = req.query.id;
    console.log("testsetestestset",id);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (id) {
        req.getConnection(function (err, connection) {
            connection.query("UPDATE email_tracking SET read_status = ?,modified_date=? WHERE id = ?", [1, created_date, id], function (err, updateres) { console.log("errrrrr", err) })
        })
    }
    console.log("id", id)
    fs.readFile(__dirname + '/../../../uploads/tracking.png', function (err, data) {
        console.log("errr", err,data)
        res.writeHead('200', { 'Content-Type': 'image/png' });
        res.end(data, 'binary');

    });

})

router.post('/student/testemail', multerUpload.fields([{ 'name': 'profile_pic' }]), function (req, res, next) {
    var post = req.body;

    response = {};
    var required_params = ['email'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var username = post.email;

        req.getConnection(function (err, connection) {
            var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
            connection.query(sql, function (err, email_template) {
                if (err) {
                    response = general.response_format(false, messages.ERROR_PROCESSING, {});
                    res.send(response);
                } else {

                    var html = email_template[0].emailtemplate_body;
                    var data = { to: post.email, subject: email_template[0].emailtemplate_subject, html: html };

                   

                    emailservice.sendMailtest(req, data, function (result) {
                        response = general.response_format(true, "Mail sent successfully", result);
                        res.send(response);
                    });
                   

                }
            });
        });
    }
    else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.send(response);
    }
});


/*api for update user Spec sheet data
Params: user_id,experience_level,currently_lived,employment_type,interested_remortely,skills
*/
router.post('/student/update_specsheet', multerUpload.fields([{ 'name': 'profile_pic' }, { 'name': 'resume' }, { 'name': 'certification' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post, req.files.resume, req.files.certification);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','experience_level','currently_lived','employment_type','interested_remortely','skills'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                connection.beginTransaction(function(err) {
                    if(err){
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/update_specsheet", "error in create transaction connection");
                        res.send(response); 
                    }else{
                        async.waterfall([
                            function(callback) {
                                //detail data
                                var checkdetails = "SELECT * FROM student_details WHERE user_id = '" + post.user_id + "' ";
                                connection.query(checkdetails, function (err, checkdetailsdata) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        if (checkdetailsdata.length > 0) {
                                            let update_specsheet = "";
                                            if(req.files.resume && req.files.resume.length > 0 && req.files.resume[0].filename){
                                                update_specsheet+=',resume = ?'
                                            } else {
                                                if(post.resume_remove && post.resume_remove == 1){
                                                    update_specsheet+=',resume = ?'
                                                }
                                            }

                                            //update data of details tab
                                            var sql = `UPDATE student_details SET experience_level = ?,currently_lived = ?,employment_type = ?, interested_remortely = ?, willing_to_works = ?, looking_for_role = ?, skills = ?, bio=?, anything_else_details=?, github_url=?, linkedin_url=?, website_url=?, updated_date=? ${update_specsheet} WHERE user_id = ${post.user_id}`;
                                            var values = [post.experience_level, post.currently_lived, post.employment_type, post.interested_remortely,post.willing_to_works, post.looking_for_role, post.skills, post.bio, post.anything_else_details, post.github_url, post.linkedin_url, post.website_url, created_date]

                                            if(req.files.resume && req.files.resume.length > 0 && req.files.resume[0].filename){
                                                // console.log("#111", path.resolve(__dirname + "../../../../uploads/resume/" + checkdetailsdata[0].resume), checkdetailsdata[0].resume);
                                                if(checkdetailsdata[0].resume) {
                                                    general.remove_file(path.resolve(__dirname + "../../../../uploads/resume/" + checkdetailsdata[0].resume));
                                                }                                                
                                                values.push(req.files.resume[0].filename)
                                            } else {
                                                if(post.resume_remove && post.resume_remove === "1"){
                                                    // console.log("#222", path.resolve(__dirname + "../../../../uploads/resume/" + checkdetailsdata[0].resume), checkdetailsdata[0].resume);
                                                    general.remove_file(path.resolve(__dirname + "../../../../uploads/resume/" + checkdetailsdata[0].resume));
                                                    values.push("")
                                                }
                                            }

                                            connection.query(sql, values, function (err, response) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    callback(null);
                                                }
                                            })
                                        } else {
                                            //insert data of details tab
                                            if(req.files.resume && req.files.resume.length > 0 && req.files.resume[0].filename){
                                                var sql = `INSERT INTO student_details (user_id,experience_level,currently_lived,employment_type,interested_remortely,willing_to_works,looking_for_role,skills,bio,anything_else_details,resume,github_url,linkedin_url,website_url,updated_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.user_id,post.experience_level, post.currently_lived, post.employment_type, post.interested_remortely,post.willing_to_works,post.looking_for_role,post.skills,post.bio,post.anything_else_details,req.files.resume[0].filename,post.github_url,post.linkedin_url,post.website_url, created_date]
                                                    ]
                                                ];
                                            } else {
                                                var sql = `INSERT INTO student_details (user_id,experience_level,currently_lived,employment_type,interested_remortely,willing_to_works,looking_for_role,skills,bio,anything_else_details,github_url,linkedin_url,website_url,updated_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.user_id,post.experience_level, post.currently_lived, post.employment_type, post.interested_remortely,post.willing_to_works,post.looking_for_role,post.skills,post.bio,post.anything_else_details,post.github_url,post.linkedin_url,post.website_url, created_date]
                                                    ]
                                                ];
                                            }
                                            
                                           connection.query(sql, values, function (err, response) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    callback(null);
                                                }
                                            })
                                        }
                                    }

                                })

                            },
                            function(callback) {
                                //for student_work_history table data
                                //first delete all rows of users and add new rows
                               
                                var checkdetails = "DELETE FROM student_work_history WHERE user_id = '" + post.user_id + "' ";
                                connection.query(checkdetails, function (err, checkdetailsdata) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        //check object and insert data
                                        var workinghistory = post.working_history ? JSON.parse(post.working_history) : [];
                                        if(post.working_history && workinghistory.length < 0) {
                                            dataCB()
                                        } else {
                                            async.forEachOf(workinghistory, function (element, key, dataCB) {
                                                var startdate = (element.start_date)?moment(element.start_date).format("YYYY-MM-DD"):moment(new Date()).utc().format("YYYY-MM-DD")
                                                var enddate = (element.end_date)?moment(element.end_date).format("YYYY-MM-DD"):null
                                                var is_present = (element.is_present)?element.is_present:0
                                                var sql = `INSERT INTO student_work_history (user_id,company_name,job_title,description,start_date,end_date,is_present) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.user_id,element.company_name, element.job_title, element.description, startdate, enddate, is_present]
                                                    ]
                                                ];
                                                connection.query(sql, values, function (err, response) {
                                                    if (err) {
                                                        dataCB(err)
                                                    } else {
                                                        dataCB()
                                                    }
                                                })
                                               
                                            }, function (err) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    callback(null);
                                                }
                                            });
                                        }

                                    }

                                })
                            },
                            function(callback) {
                                //for student_education table data
                                //first delete all rows of users and add new rows
                               
                                var checkdetails = "DELETE FROM student_education WHERE user_id = '" + post.user_id + "' ";
                                connection.query(checkdetails, function (err, checkdetailsdata) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        //check object and insert data
                                        var workinghistory = post.student_education ? JSON.parse(post.student_education) : [];
                                        if(post.student_education && workinghistory.length < 0) {
                                            dataCB()
                                        } else {
                                            async.forEachOf(workinghistory, function (element, key, dataCB) {
                                                var startdate = (element.start_date)?moment(element.start_date).format("YYYY-MM-DD"):moment(new Date()).utc().format("YYYY-MM-DD")
                                                var enddate = (element.end_date)?moment(element.end_date).format("YYYY-MM-DD"):null
                                                var is_present = (element.is_present)?element.is_present:0
                                                var sql = `INSERT INTO student_education (user_id,institution_name,degree_name,description,start_date,end_date,is_present) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.user_id,element.institution_name, element.degree_name, element.description, startdate, enddate, is_present]
                                                    ]
                                                ];
                                                connection.query(sql, values, function (err, response) {
                                                    if (err) {
                                                        dataCB(err)
                                                    } else {
                                                        dataCB()
                                                    }
                                                })
                                            
                                            }, function (err) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    callback(null);
                                                }
                                            });
                                        }

                                    }

                                })
                            },
                            function(callback) {
                                //for student_attachment table data
                                //first delete if certification_remove true

                                var attachmentremove = (post.certification_remove && post.certification_remove_data) ? JSON.parse(post.certification_remove_data) : [];
                                if(post.certification_remove && post.certification_remove === "1" && post.certification_remove_data.length > 0){
                                    async.forEachOf(attachmentremove, function (element, key, dataCB) {
                                        // console.log('attachment remove element ===>', element, key);

                                        var sql = `DELETE FROM student_attachment WHERE user_id=${post.user_id} AND id=${element.id}`;
                                        connection.query(sql, function (err, response) {
                                            if (err) {
                                                dataCB(err)
                                            } else {
                                                general.remove_file(path.resolve(__dirname + "../../../../uploads/certification/" + element.certification));
                                                dataCB()
                                            }
                                        })
                                    }, function (err) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null);
                                        }
                                    });
                                    
                                } else {
                                    callback(null)
                                }
                            },
                            function(callback) {
                                //for student_attachment table data
                                //check object and insert data
                                if(req.files.certification && req.files.certification.length > 0){
                                    async.forEachOf(req.files.certification, function (element, key, dataCB) {
                                        // console.log('attachment add element ===>', element, key);

                                        var sql = `INSERT INTO student_attachment (user_id,certification) VALUES ?`;
                                        var values = [
                                            [
                                                [post.user_id,element.filename]
                                            ]
                                        ];
                                        connection.query(sql, values, function (err, response) {
                                            if (err) {
                                                dataCB(err)
                                            } else {
                                                dataCB()
                                            }
                                        })
                                    }, function (err) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null);
                                        }
                                    });
                                } else {
                                    callback(null)
                                }
                            },
                            function(callback) {
                                //update user and set is_spec_sheet_added = 1
                                var sql = "UPDATE user SET is_spec_sheet_added = 1 WHERE id = " + post.user_id;
                                
                                connection.query(sql, function (err, response) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        callback(null);
                                    }
                                })

                            },
                       
                        ],(err,result)=>{
                            if(err){
                                console.log("eeeee",err)
                                connection.rollback(()=>{
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/update_specsheet", "error student/update_specsheet");
                                    res.send(response);
                                })  
                            }else{
                                connection.commit((err)=>{
                                    if(err){
                                        connection.rollback(()=>{
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/update_specsheet", "Error in commit transaction while specisheet data insert");
                                            res.send(response);
                                        })
                                    }else{
                                        
                                        response = general.response_format(true,messages.SUCCESS, {}, connection, post, "student/update_specsheet", "Specsheet data added successfully");
                                        res.send(response);
                                    }
                                })
                            }
                        })
                   }
                })
            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for check intro discovery call inerview request with DB
Params: user_id,id
*/
router.post('/student/check_intro_discovery_call_request', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
       
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
               //get the data of watchlist student 
               var checkid = `SELECT * FROM watchlist_student where id=${post.id};`
               connection.query(checkid, function (err, checkiddata) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/student/check_intro_discovery_call_request", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        //if check id data >0 then move ahead otehrwise give message link not valid
                        if(checkiddata.length > 0){
                            //check the watchlist status if watchlist is open thhen move ahead
                            if(checkiddata[0].status == 2){
                                var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                                connection.query(checkwid, function (err, checkiwddata) {
                                    if (err) {
                                        console.log("err",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "/student/check_intro_discovery_call_request", 'Mysql error in wathclist query');
                                        res.send(response);
                                    } else {
                                        if(checkiwddata[0].status == 1){
                                            var tempobj = {}
                                           
                                            tempobj.role_title = checkiwddata[0].role_title
                                            tempobj.primary_contact =checkiwddata[0].primary_contact
                                            tempobj.description =checkiwddata[0].description
                                            tempobj.company_timeslot = [];

                                            //get data of company
                                            
                                            var sql = `SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = ${checkiddata[0].user_id};`
                                            connection.query(sql, function (err, checkcdata) {
                                                if (err) {
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/check_intro_discovery_call_request", 'Mysql error in company query');
                                                    res.send(response);
                                                } else {
                                                    tempobj.company_name = checkcdata[0].company_name ? checkcdata[0].company_name : '';
                                                }
                                            });
                                            
                                            //get data of watchlist and timeslot

                                            var checkdetails = `SELECT * FROM company_timeslot WHERE user_id = ${checkiwddata[0].user_id};`
                                            console.log('checkdetails',checkdetails)
                                            connection.query(checkdetails, function (err, checkdetailsdata) {
                                                if (err) {
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_company_timeslot", 'Mysql error in get timeslot query');
                                                    res.send(response);
                                                } else {
                                                    console.log("checkdetailsdata",checkdetailsdata)
                                                    
                                                    if(checkdetailsdata.length > 0){
                                                        tempobj.company_timeslot = checkdetailsdata
                                                    }
                                                    response = general.response_format(true, messages.SUCCESS, tempobj, connection, post, "student/check_intro_discovery_call_request", "success");
                                                    res.send(response);
                                                }
                                            })
                                            
                                        }else{
                                            response = general.response_format(false, messages.FULL_FILL_REQUIRMENT, {}, connection, post, "student/check_intro_discovery_call_request", 'fullfill requirement');
                                            res.send(response);     
                                        }
                                    }
                                })
                            }else{
                                response = general.response_format(false, messages.LINK_NOT_VALID, {}, connection, post, "student/check_intro_discovery_call_request", 'Link not valid1');
                                res.send(response);
                            }
                            

                        }else{
                            response = general.response_format(false, messages.LINK_NOT_VALID, {}, connection, post, "student/check_intro_discovery_call_request", 'Link not valid2');
                            res.send(response);
                        }

                    }
                })
            }
        })
    }  else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for set intro discovery call inerview timeslot
Params: user_id,id,on_date,type,timeslot1,timeslot2,timeslot3
type= 0=predefined,1=custom
*/
router.post('/student/set_intro_discovery_call_timeslot', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['id','on_date','type','timeslot1'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var timeslot1 = (post.timeslot1)?post.timeslot1:''
        var timeslot2 = (post.timeslot1)?post.timeslot2:''
        var timeslot3 = (post.timeslot1)?post.timeslot3:''
        var customdate = moment(post.on_date).format('MM-DD-YYYY')
        // var d = new Date(post.on_date);
        // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY");
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
               
                var checkid = `SELECT * FROM watchlist_student where id=${post.id};`
               connection.query(checkid, function (err, checkiddata) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/student/offer_accept_reject", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                        connection.query(checkwid, function (err, checkiwddata) {
                            if (err) {
                                console.log("err",err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "/student/offer_accept_reject", 'Mysql error in wathclist query');
                                res.send(response);
                            } else {
                                if(checkiwddata[0].status == 3 || checkiwddata[0].status == 2){
                                    response = general.response_format(false, messages.FULL_FILL_REQUIRMENT, {}, connection, post, "student/offer_accept_reject", 'fullfill requirement');
                                    res.send(response);    
                                }else{
                                    if(checkiddata[0].status == 3){
                                        response = general.response_format(false, "You have already set the timeslot for intro discovery call", {}, connection, post, "student/offer_accept_reject", 'fullfill requirement');
                                        res.send(response);    

                                    }else{
                                        var sql = "UPDATE watchlist_student SET status = ?,intro_discovery_response_type=?,intro_discovery_response_on_date=?,intro_discovery_response_timeslot1=?,intro_discovery_response_timeslot2=?,intro_discovery_response_timeslot3=? WHERE id = ?";
                                        connection.query(sql, [3,post.type,post.on_date,timeslot1,timeslot2,timeslot3, post.id], function (err, updateres) {
                                            if (err) {
                                                console.log("err",err)
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/set_intro_discovery_call_timeslot", 'Error in update query');
                                                res.send(response);
                                            } else {
                                                if(post.type == 0){
                                                    //email-start for admin for forgot password
                                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 14;
                                                    SELECT c.company_name,u.email FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {

                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/forgotpassword", 'email_template err');
                                                            res.send(response);
                                                        } else {
                                                            //TODO - Need to change url of company confirm interview list after student select timeslot of interview
                                                            var studentnumber = "#"+checkiddata[0].student_id;
                                                            var cutomurl = constants.COMPANY_APP_URL+"company/requestconfirm"
                                                            var html = email_template[0][0].emailtemplate_body;
                                                            var html = html.replace(/{candidate_number}/gi, (studentnumber) ? studentnumber : '');
                                                            var html = html.replace(/{company_name}/gi, (email_template[1][0].company_name) ? email_template[1][0].company_name : '');
                                                            var html = html.replace(/{watchlist_name}/gi, (checkiwddata[0].role_title) ? checkiwddata[0].role_title : '');
                                                            var html = html.replace(/{on_date}/gi, (customdate) ? customdate : '');
                                                            var html = html.replace(/{customlink}/gi, (cutomurl) ? cutomurl : '');
                                                            var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                            console.log("mail call", html)
                                                            emailservice.sendMailnew(req, data, function (result) {
                                                                console.log("result", result)
                                                            });
                                                            response = general.response_format(true, "Request submitted successfully", {}, connection, post, "cstudent/set_intro_discovery_call_timeslot", "Data updated successfully");
                                                            res.send(response);

                                                        }
                                                    });
                                                }else{
                                                   
                                                    var slot1 = ''
                                                    var slot2 = ''
                                                    var slot3 = ''
                                                    // if(timeslot1){
                                                    //     var slot1 = momentzone(timeslot1,["h:mm A"]).tz("America/Los_Angeles").format("h:mm A");
                                                    // }
                                                    // if(timeslot2){
                                                    //     var slot2 = momentzone(timeslot2,["h:mm A"]).tz("America/Los_Angeles").format("h:mm A");
                                                    // }
                                                    // if(timeslot3){
                                                    //     var slot3 = momentzone(timeslot3,["h:mm A"]).tz("America/Los_Angeles").format("h:mm A");
                                                    // }
                                                   
                                                    //when alternate timeslot selected
                                                    //email-start for admin for forgot password
                                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 15;
                                                    SELECT c.company_name,u.email FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {

                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/forgotpassword", 'email_template err');
                                                            res.send(response);
                                                        } else {
                                                            //TODO - Need to change url of company confirm interview list after student select timeslot of interview
                                                            var studentnumber = "#"+checkiddata[0].student_id;
                                                            var cutomurl = constants.COMPANY_APP_URL+"company/requestconfirm"
                                                            var html = email_template[0][0].emailtemplate_body;
                                                            var html = html.replace(/{candidate_number}/gi, (studentnumber) ? studentnumber : '');
                                                            var html = html.replace(/{company_name}/gi, (email_template[1][0].company_name) ? email_template[1][0].company_name : '');
                                                            var html = html.replace(/{watchlist_name}/gi, (checkiwddata[0].role_title) ? checkiwddata[0].role_title : '');
                                                            var html = html.replace(/{on_date}/gi, (customdate) ? customdate : '');
                                                            var html = html.replace(/{customlink}/gi, (cutomurl) ? cutomurl : '');
                                                            var html = html.replace(/{slot1}/gi, (timeslot1) ? timeslot1 : '');
                                                            var html = html.replace(/{slot2}/gi, (timeslot2) ? timeslot2 : '');
                                                            var html = html.replace(/{slot3}/gi, (timeslot3) ? timeslot3 : '');
                                                            var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                            console.log("mail call", html)
                                                            emailservice.sendMailnew(req, data, function (result) {
                                                                console.log("result", result)
                                                            });
                                                            response = general.response_format(true, "Request submitted successfully", {}, connection, post, "cstudent/set_intro_discovery_call_timeslot", "Data updated successfully");
                                                            res.send(response);

                                                        }
                                                    });
                                                }
                                                
                                               
                                            
                                            }
                                        });
                                    }
                                }
                            }
                        })
                                    
                    }
                })    
                
            }
        })
    }  else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for accept/reject offer sent by company
Params: id,status
*/
router.post('/student/offer_accept_reject', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var currenttime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
    var required_params = ['id','status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var status = (post.status == 0)?11:10
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
               //get the data of watchlist student 
               var checkid = `SELECT * FROM watchlist_student where id=${post.id};`
               connection.query(checkid, function (err, checkiddata) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/student/offer_accept_reject", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        var res_message = (status==10)?"Thank you for accepting offer":"Offer rejected successfully"
                        //if check id data >0 then move ahead otehrwise give message link not valid
                        if(checkiddata.length > 0){
                            //check the watchlist status if watchlist is open thhen move ahead
                            if(checkiddata[0].status == 9){
                                var checkwid = `SELECT cw.*,ct.name as location FROM company_watchlist cw LEFT JOIN city ct ON ct.id=cw.city where cw.id=${checkiddata[0].watchlist_id};`
                                connection.query(checkwid, function (err, checkiwddata) {
                                    if (err) {
                                        console.log("err",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "/student/offer_accept_reject", 'Mysql error in wathclist query');
                                        res.send(response);
                                    } else {
                                        if(checkiwddata[0].status == 1){
                                            var sql = "UPDATE watchlist_student SET status = ?,offer_confirm_date=? WHERE id = ?";
                                            connection.query(sql, [status,currenttime, post.id], function (err, updateres) {
                                                if (err) {
                                                    console.log("err",err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/offer_accept_reject", 'Error in update query');
                                                    res.send(response);
                                                } else {
                                                    if(status == 10){
                                                        var getstudent = `SELECT * FROM user WHERE id = ${checkiddata[0].student_id};`
                                                        connection.query(getstudent, function (err, getstudent) {
                                                            if (err) {
                                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/offer_accept_reject", 'Mysql error in check user query');
                                                                res.send(response);
                                                            } else {
                                                                var current_progress_status = getstudent[0].current_progress_status;
                                                                console.log("current_progress_status",current_progress_status);
                                                                if(current_progress_status == 4) {
                                                                    var sql = "UPDATE user SET looking_for_job = 0, current_progress_status = 5 WHERE id = " + checkiddata[0].student_id;
                                                                } else {
                                                                    var sql = "UPDATE user SET looking_for_job = 0 WHERE id = " + checkiddata[0].student_id;
                                                                }
                                                                
                                                                connection.query(sql, function (err, updateres) {
                                                                    if (err) {
                                                                        console.log("err",err)
                                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/offer_accept_reject", 'Error in update query user');
                                                                        res.send(response);
                                                                    } else {
                                                                            var sql = `UPDATE watchlist_student SET status = 12 WHERE id != ${post.id} AND student_id=${checkiddata[0].student_id} AND status=9;`
                                                                            connection.query(sql, function (err, updateres) {
                                                                                if (err) {
                                                                                    console.log("err",err)
                                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/offer_accept_reject", 'Error in update query');
                                                                                    res.send(response);
                                                                                } else {
                                                                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 18;
                                                                                        SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${checkiddata[0].student_id};
                                                                                        SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;
                                                                                        SELECT u.full_name,u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${checkiddata[0].user_id};`;
                                                                                        console.log(sql)
                                                                                        connection.query(sql, function (err, email_template) {
                                                                                            if (err) {
                                                                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'email_template err');
                                                                                                res.send(response);
                                                                                            } else {
                                                                                                // var company_name = email_template[3][0].first_name+" "+email_template[3][0].last_name
                                                                                                var company_name = email_template[3][0].full_name
                                                                                                var candidate_name = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                                                                                var html = email_template[0][0].emailtemplate_body;
                                                                                                
                                                                                                var html = html.replace(/{company_name}/gi, (company_name) ? company_name : '');
                                                                                                var html = html.replace(/{candidate_name}/gi, (candidate_name) ? candidate_name : '');
                                                                                                var html = html.replace(/{role_location}/gi, (checkiwddata[0].location) ? checkiwddata[0].location : '');
                                                                                                var html = html.replace(/{role_title}/gi, checkiwddata[0].role_title);
                                                                                                var data = { to: email_template[3][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                                                                console.log("mail call", html)
                                                                                                emailservice.sendMailnew(req, data, function (result) {
                                                                                                    console.log("result", result)
                                                                                                });
                                                                                                response = general.response_format(true, res_message, {}, connection, post, "student/offer_accept_reject", "Data updated successfully");
                                                                                                res.send(response);
                                                                        
                                                                                            }
                                                                                        });
                                                                                }
                                                                            });
                                                                            
                                                                    }
                                                                });

                                                            }
                                                        });

                                                }else{
                                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 18;
                                                        SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${checkiddata[0].student_id};
                                                        SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;
                                                        SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${checkiddata[0].user_id};`;
                                                        console.log(sql)
                                                        connection.query(sql, function (err, email_template) {
                                                            if (err) {
                                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'email_template err');
                                                                res.send(response);
                                                            } else {
                                                                var company_name = email_template[3][0].first_name+" "+email_template[3][0].last_name
                                                                var candidate_name = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                                                var html = email_template[0][0].emailtemplate_body;
                                                                
                                                                var html = html.replace(/{company_name}/gi, (company_name) ? company_name : '');
                                                                var html = html.replace(/{candidate_name}/gi, (candidate_name) ? candidate_name : '');
                                                                var html = html.replace(/{role_location}/gi, (checkiwddata[0].location) ? checkiwddata[0].location : '');
                                                                var html = html.replace(/{role_title}/gi, checkiwddata[0].role_title);
                                                                var data = { to: email_template[3][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                                console.log("mail call", html)
                                                                emailservice.sendMailnew(req, data, function (result) {
                                                                    console.log("result", result)
                                                                });
                                                                response = general.response_format(true, res_message, {}, connection, post, "student/offer_accept_reject", "Data updated successfully");
                                                                res.send(response);
                                        
                                                            }
                                                        });
                                                   
                                                }
                                                    
                                                }
                                            });
                                            
                                        }else{
                                            response = general.response_format(false, messages.FULL_FILL_REQUIRMENT, {}, connection, post, "student/offer_accept_reject", 'fullfill requirement');
                                            res.send(response);     
                                        }
                                    }
                                })
                            }else if(checkiddata[0].status == 10){
                                response = general.response_format(false, "You have already accepted this offer", {}, connection, post, "student/offer_accept_rejectt", 'Link not valid1');
                                res.send(response);
                            }else if(checkiddata[0].status == 11){
                                response = general.response_format(false, "You have already rejected this offer", {}, connection, post, "student/offer_accept_rejectt", 'Link not valid1');
                                res.send(response);
                            }else if(checkiddata[0].status == 12){
                                response = general.response_format(false, "You have already accepted offer of other company", {}, connection, post, "student/offer_accept_rejectt", 'Link not valid1');
                                res.send(response);
                            }else{
                                response = general.response_format(false, messages.LINK_NOT_VALID, {}, connection, post, "student/offer_accept_rejectt", 'Link not valid1');
                                res.send(response);
                            }
                        }else{
                            response = general.response_format(false, messages.LINK_NOT_VALID, {}, connection, post, "student/offer_accept_reject", 'Link not valid2');
                            res.send(response);
                        }

                    }
                })
            }
        })
    }  else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for student dashboard with profile details and other company activity
Params: user_id
*/
router.post('/student/getdashboard', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = "SELECT * from user where id = ? ";
                let query_data = [post.user_id];
                connection.query(sql, query_data, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/getprofile", 'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        var user = { user_id: result[0].id };
                        general.get_user_structure_data(req, user, function (result) {
                            if (result.status == 1) {
                                console.log("#user pic", user, result);
                                var data = {
                                    user_deatils: result.data,
                                    other_company_data: []
                                };

                               
                                async.waterfall([
                                    function(callback) {
                                        var responsedata = []
                                        let search_query = `u.student_id=${post.user_id} AND cw.status=1`;
                                        //get data of other company where watchlist is active.
                                        var searchq = `SELECT u.*,cw.role_title,cw.salary,c.company_name,ct.name as place
                                            FROM watchlist_student u
                                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                                            LEFT JOIN user us ON us.id=u.user_id 
                                            LEFT JOIN company c ON c.id=us.company_id
                                            LEFT JOIN city ct ON ct.id=cw.city
                                            WHERE ${search_query} ORDER BY u.id DESC;`
                                            connection.query(searchq, function (err, result) {
                                                if (err) {
                                                    console.log("err", err);
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/getprofile", 'Problem in select query');
                                                    res.send(response);
                                                } else {
                                                    async.forEachOf(result, function (element, key, dataCB) {
                                                        var hasoffer = ''
                                                        if(element.status==9){
                                                            hasoffer = 'Yes'
                                                        }else if(element.status==10){
                                                            hasoffer = 'Hired'
                                                        }else if(element.status==11){
                                                            hasoffer = 'Rejected'
                                                        }else{
                                                            hasoffer = 'No'
                                                        }
                                                        var tempobj = {}
                                                        
                                                        tempobj.company_name = element.company_name
                                                        tempobj.position =element.role_title
                                                        tempobj.salary =element.salary
                                                        tempobj.place =element.place
                                                        tempobj.has_offer =hasoffer
                                                        tempobj.interviewed =(element.status>4)?'Yes':'No'
                                                        responsedata.push(tempobj)
                                                    
                                                        dataCB()
                                                    }, function (err) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                            res.send(response);
                                                        } else {
                                                            console.log("responsedata",responsedata)
                                                            data.other_company_data = responsedata
                                                            callback(null)   
                                                        }
                                                    });
                                                }
                                            })
                                            
                                    },function(callback) {
                                        //detail data
                                        var gettechnicalskill = `SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') as technicalskills from skills WHERE id IN(SELECT skill_id from student_skill where user_id=${post.user_id}) ;`
                                        console.log("gettechnicalskill",gettechnicalskill)
                                        connection.query(gettechnicalskill, function (err, gettechnicalskilldata) {
                                            if (err) {
                                                callback(null);
                                            } else {
                                                data.technical_assisment = gettechnicalskilldata[0].technicalskills
                                                callback(null);   
                                            }
                                        })
    
                                    }
                                
                                ],(err,result)=>{
                                   if(err){
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/getprofile", 'Problem in select query');
                                        res.send(response);
                                   }else{
                                        response = general.response_format(true, 'Success', data, connection, post, "front/student/getprofile", 'Get user data');
                                        res.send(response);
                                   }
                                   
                                })
                              

                            }
                            else {
                                //  res.send(result);
                                response = general.response_format(false, result.message, {}, connection, post, "front/student/getprofile", 'result.status !=1');
                                res.send(response);
                            }
                        });

                    } else {
                        //if email not exist
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/getprofile", 'User not found for user id');
                        res.send(response);
                    }
                })


            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

module.exports = router;

