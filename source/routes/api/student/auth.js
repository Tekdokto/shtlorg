var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require("passport");
var request = require("request");
var eml = require('../../../services/email');
var emailservice = eml.func();
var generalfunction = require('../../../services/general');
var general = generalfunction.func();
const constants = require('../../../config/constants');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var msg = require('../../../config/messages');
var messages = msg.messages;
require("../passport")();

router.route('/twitter/reverse').post(function (req, res) {
    request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
            oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
            consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET_KEY
        }
    }, function (err, r, body) {
        if (err) {
            return res.send(500, { message: e.message });
        }
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
    });
});

router.route('/twitter').post((req, res, next) => {
    request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
            consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET_KEY,
            token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
        if (err) {
            return res.send(500, { message: err.message });
        }

        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
    });
}, passport.authenticate('twitter-token', { session: false }), function (req, res, next) {
    if (!req.user) {
        return res.json({ status: 0, message: "User not authenticated" });
    }
    let token = Users.generateJWT(req.user.email, req.user.id);
    let data = JSON.parse(JSON.stringify(req.user))
    delete data['hash'];
    delete data['salt'];
    return res.json({ status: 1, data, token });
});

/**
    oauth_token
    oauth_token_secret
    user_id
 */
router.route('/twitter-mobile-app-login').post(passport.authenticate('twitter-token', { session: false }), function (req, res, next) {
    if (!req.user) {
        return res.json({ status: 0, message: "User not authenticated" });
    }
    let token = Users.generateJWT(req.user.email, req.user.id);
    let data = JSON.parse(JSON.stringify(req.user))
    delete data['hash'];
    delete data['salt'];
    return res.json({ status: 1, data, token });
});
router.post('/auth/abc',function(req,res){
console.log("test")

})
router.route('/auth/facebook').post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
    console.log("req.user",req.user)
    if (!req.user) {
       
        response = general.response_format(false, '"User not authenticated', {});
        res.send(response);
    }else{
        console.log("req.user",req.user)
        var profile = req.user;
        var email = profile.emails[0].value
        var fid = profile.id
        var first_name= profile.name.givenName
        var last_name= profile.name.familyName
        var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("req.user",email,fid,first_name,last_name)

        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let sql = `SELECT * from user where email = '${email}' AND status != 2 AND role_id = 2 `;
                                    
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

                            connection.query("UPDATE user SET facebook_id = '" + fid + "' WHERE id = '" + result[0].id + "'", function (err, data) {
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
                                            response = general.response_format(true, messages.SUCCESS, result.data, connection, req.user, "front/auth/facebook", "user login successfully");
                                            response.token = token;
                                            res.send(response);
                                    });
                                }
                            })
                        }

                    }else{

                        //if not exist then add new row with all data and login user response

                        var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                        var sql = `INSERT INTO user (first_name,last_name,email,facebook_id,password,auth_key,is_verified,email_verify_time,role_id,created_date) VALUES ?`;
                        var values = [
                            [
                                [first_name,last_name,email,fid,'',user_verifytoken,1,created_date,2,created_date]
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
                                        emailservice.sendMail(req, data, function (result) {
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
                                                response = general.response_format(true, messages.SUCCESS, result.data, connection, req.user, "front/auth/facebook", "user login successfully");
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
  
   
});



router.route('/auth/google')
    .post(passport.authenticate('google-token', { session: false }), function (req, res, next) {
        if (!req.user) {
       
            response = general.response_format(false, '"User not authenticated', {});
            res.send(response);
        }else{
            console.log("requser",req.user)
            var profile = req.user;
            var email = profile.emails[0].value
            var fid = profile.id
            var first_name= profile.name.givenName
            var last_name= profile.name.familyName
            var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
            console.log("req.user",email,fid,first_name,last_name)
            req.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                    res.send(response);
                } else {
                    let sql = `SELECT * from user where email = '${email}' AND status != 2 AND role_id = 2 `;
                                        
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
    
                                connection.query("UPDATE user SET google_id = '" + fid + "' WHERE id = '" + result[0].id + "'", function (err, data) {
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
                                                response = general.response_format(true, messages.SUCCESS, result.data, connection, req.user, "front/auth/facebook", "user login successfully");
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
                                    [first_name,last_name,email,fid,'',user_verifytoken,1,created_date,2,created_date]
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
                                            emailservice.sendMail(req, data, function (result) {
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
                                                    response = general.response_format(true, messages.SUCCESS, result.data, connection, req.user, "front/auth/facebook", "user login successfully");
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

      
    });

module.exports = router;