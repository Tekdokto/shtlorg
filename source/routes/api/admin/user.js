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
// Listing
router.get('/user/test', (req, res) => {
    console.log(" tetstestset");

    res.json({
        "status": 1,
        "data": [],
    });
   
});
router.post('/user/signupadmin',multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    var post = req.body;
    var required_params = ['first_name', 'last_name', 'email', 'password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    
    if (valid) {

        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/adduser", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkemailq = "SELECT * FROM user WHERE email = '" + post.email + "' AND status!='2' AND role_id = '"+post.role+"' ";
                connection.query(checkemailq, function (err, checkemail) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (checkemail.length > 0) {
                            var msg = "Email already exist";
                            response = general.response_format(false, msg, {}, connection, post, "admin/user/adduser", msg);
                            res.send(response);
                        } else {

                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                    res.send(response);
                                } else {
                                    bcrypt.hash(post.password, salt, function (err, hash) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                            res.send(response);
                                        } else {
                                            var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                            var sql = `INSERT INTO user (first_name,last_name,email,password,auth_key,is_verified,email_verify_time,is_password_changed,role_id,created_date) VALUES ?`;
                                            var values = [
                                                [
                                                    [post.first_name, post.last_name, post.email, hash, user_verifytoken, 0, created_date,constants.IS_PASSWORD_CHANGED, post.role, created_date]
                                                ]
                                            ];
                                            connection.query(sql, values, function (err, rowsdata) {
                                                if (err) {
                                                    console.log(err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in create user query');
                                                    res.send(response);
                                                } else {
                                                    var user_id = rowsdata.insertId;
                                                    var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 2; ";
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.ERROR_PROCESSING, {}, connection, post, "admin/user/signup", 'email_template err');
                                                            res.send(response);
                                                        } else {

                                                            var html = email_template[0].emailtemplate_body;
                                                            var html = html.replace(/{link}/gi, constants.ADMIN_URL + "auth/emailverifyadmin/" + user_verifytoken + " ");
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
                                                                response = general.response_format(true, messages.PROFILE_CREATED, result.data, connection, post, "front/user/adduser", "user registered successfully");

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
                })
            }
        });
    } else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);
    }
})
router.post('/user/login',multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);


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
                let sql = "SELECT * from user where email = ? AND status != ? AND role_id = ? ";
                let query_data = [post.email,2,1];
                connection.query(sql, query_data, function (err, result) {
                    if (err) {
                        console.log("err",err);
                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/login",'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {

                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {},connection,post,"admin/user/login",'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {},connection,post,"admin/user/login",'account is deleted');
                            res.send(response);
                        } else {
                            bcrypt.compare(post.password, result[0].password, (err, db_res) => {
                                if (db_res) {
                                    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                    connection.query("UPDATE user SET auth_token_verify_time = '" + created_date + "' WHERE id = '" + result[0].id + "'", function (err, data) {
                                        if (err) {
                                            console.log("eror", err)
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/admin/login", 'error in update query auth time');
                                            res.json(response);
                                        } else {
                                            let jwtData;

                                            var user = { user_id: result[0].id };
                                            general.get_user_structure_data(req, user, function (result) {
                                                if (result.status == 1) {
                                                    console.log("#user pic", user,result);
                                                    jwtData = result.data;
                                                    const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                        expiresIn: 60 // 1 day
                                                    });
                                                    var data = {
                                                        user_id: result.data.user_id
                                                    };
        
                                                    
                                                    response = general.response_format(true, 'User Login Successfully', result.data,connection,post,"admin/user/login",'User Login Successfully');
                                                    response.token = token;
                                                    res.send(response);
                                                    
                                                }
                                                else {
                                                    //  res.send(result);
                                                    response = general.response_format(false, result.message, {},connection,post,"admin/user/login",'result.status !=1');
                                                    res.send(response);
                                                }
                                            });


                                        }
                                    })
                                   
                                } else {

                                    response = general.response_format(false, messages.PASSWORD_DOES_NOT_MATCH, {});
                                    res.send(response);
                                }
                            })
                        }

                    } else {
                        //if email not exist
                        response = general.response_format(false, "Email address is not registered", {},connection,post,"admin/user/login",'email address not registered');
                        res.send(response);
                    }
                })
            }
        })
    } else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test",str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test",response);
        
        res.send(response);
    }
})
//API for forgot password and send link too user
//this api for admin forgot password
router.post('/user/forgotpassword', upload.array(), function (req, res, next) {
    var post = req.body;
console.log("in forgot password")
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

                var check_sql = "SELECT * FROM user  WHERE status  IN (0,1) AND (email = ? ) AND role_id = 1 ";
                var check_values = [username];
    
                connection.query(check_sql, check_values, function (err, rows) {
                    if (err) {
                        response = general.response_format(false, err, {},connection,post,"admin/user/forgotpassword",'User check email and status');
                        res.send(response);
                    }
                    else {
                        if (rows.length > 0) {
                            if (rows[0].status == 0) {
                                response = general.response_format(false, messages.INACTIVE_ACCOUNT, {},connection,post,"admin/user/forgotpassword",'Account is deactivated');
                                res.send(response);
                            }
                            else {
                                console.log("in forgot password",rows)
                                var passwordResetToken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                var sql = "UPDATE `user` SET password_reset_token=?,password_reset_time=? WHERE id = ?";
                                var values = [passwordResetToken,moment().format('YYYY-MM-DD HH:mm:ss'), rows[0].id];
                                connection.query(sql, values, function (err, updateResetToken) {
                                    if (err) {
                                        response = general.response_format(false, messages.ERROR_PROCESSING, {},connection,post,"admin/user/forgotpassword",'Error in update forgot password token');
                                        res.send(response);
                                    }
                                    else {
                                        //email-start
                                        var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 1; ";
                                        connection.query(sql, function (err, email_template) {
                                            if (err) {
                                                
                                                response = general.response_format(false, messages.ERROR_PROCESSING, {},connection,post,"admin/user/forgotpassword",'email_template err');
                                                res.send(response);
                                            } else {
                                                
                                                var html = email_template[0].emailtemplate_body;
                                                var html = html.replace(/{first_name}/gi, rows[0].first_name);
                                                var html = html.replace(/{last_name}/gi, rows[0].last_name);
                                                var html = html.replace(/{url}/gi, constants.ADMIN_URL + "auth/reset-password/" + passwordResetToken + " ");
                                                
                                                var data = { to: rows[0].email, subject: email_template[0].emailtemplate_subject, html: html };
                                                console.log("mail call")
                                                emailservice.sendMailnew(req, data, function (result) {
                                                    console.log("result",result)
                                                });
                                                response = general.response_format(true, 'Mail sent successfully', {},connection,post,"admin/user/forgotpassword",'Mail sent successfully');
                                                    res.send(response);
                                               
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            response = general.response_format(false, messages.USER_NOT_FOUND, {},connection,post,"admin/user/forgotpassword",'user not found');
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
router.post('/user/verifypasswordtoken', upload.array(), function (req, res) {
    var response = {};
    console.log("verify token admin")
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
                var sql = "SELECT * FROM user WHERE password_reset_token = ? AND status = ?";
                connection.query(sql, [post.token, 1], function (err, rows) {
                    if (err) {
                       
                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/verifypasswordtoken",'error in select query');
                        res.json(response);
                    } else {
                        if (rows.length > 0) {
                            if (rows[0].password_reset_time != null && rows[0].password_reset_time != "" && rows[0].password_reset_time != "null") {
                                var currenttime = moment().format('YYYY-MM-DD HH:mm:ss');
                                var resettime = moment(rows[0].password_reset_time).format('YYYY-MM-DD HH:mm:ss');
                                console.log("reset time", resettime);
                                var diff = moment.duration(moment(currenttime).diff(moment(resettime))).asMinutes();
                                console.log("difff", diff);
                                if (diff > 1440) {
                                    response = general.response_format(false, 'Link has been Expires.Please Try again!',{},connection,post,"admin/user/verifypasswordtoken",'Link has been Expires');
                                    res.send(response);
                                } else {
                                    response = general.response_format(true, messages.SUCCESS, rows[0],connection,post,"admin/user/verifypasswordtoken",'Success');
                                    res.send(response);
                                }
                            } else {
                                response = general.response_format(true, messages.SUCCESS, rows[0],connection,post,"admin/user/verifypasswordtoken",'Success');
                                res.send(response);
                            }
                        } else {
                            response = general.response_format(false, "Link is not valid", {},connection,post,"admin/user/verifypasswordtoken",'Link is not valid');
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
router.post('/user/resetpassword', upload.array(), function (req, res) {
    var response = {};
    console.log("reset password admin")
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
                var sql = "SELECT * FROM user WHERE password_reset_token = ? AND status = ?";
                connection.query(sql, [post.token, 1], function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/resetpassword",'error in select query');
                        res.json(response);
                    } else {
                        if (rows.length > 0) {
                                bcrypt.genSalt(10, function (err, salt) {
                                    if (err) {
                                        response = general.response_format(false, err, {},connection,post,"admin/user/resetpassword",'bcrypt.genSalt');
                                        res.send(response);
                                    }
                                    else {
                                        bcrypt.hash(post.confirmpassword, salt, function (err, hash) {
                                            if (err) {
                                               
                                                response = general.response_format(false, err, {},connection,post,"admin/user/resetpassword",'bcrypt.hash');
                                                res.send(response);
                                            }
                                            else {
                                                var sql = "UPDATE `user` SET password=?,password_reset_token=?,password_reset_time = ?  WHERE id = ?";
                                                var values = [hash, "", moment().format('YYYY-MM-DD HH:mm:ss'), rows[0].id];
                                                connection.query(sql, values, function (err, data) {
                                                    if (err) {
                                                        response = general.response_format(false, err, {},connection,post,"admin/user/resetpassword",'error in update password query');
                                                        res.send(response);
                                                    }
                                                    else {
                                                        response = general.response_format(true, messages.PASSWORD_UPDATED, {},connection,post,"admin/user/resetpassword",'Password updated successfully');
                                                        res.send(response);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                           
                        } else {
                            response = general.response_format(false, "Link is not valid", {},connection,post,"admin/user/resetpassword",'Link is not valid');
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

router.post('/user/changepassword', upload.array(),functions.verifyTokenAdmin, function (req, res, next) {
    var post = req.body;
    response = {};
    console.log('change password:',post);
    
    var required_params = ['password', 'currentpassword', 'admin_id'];
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
                connection.query("SELECT * FROM user WHERE id='" + post.admin_id + "' AND status = 1 AND role_id = '1'", function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/changepassword",'error in select query');
                        res.json(response);
                        // res.json({ "status": 0, "message": messages.OOPS });
                    } else {
                        if (rows.length > 0) {
                            var password_hash = rows[0].password;
                            var user_id = rows[0].user_id;
                            // Load hash from your password DB.
                            bcrypt.compare(currentpassword, password_hash, function (err, result) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/changepassword",'error in bcrypt compare');
                                    res.json(response);
                                } else {
                                    if (result == true) {
                                        bcrypt.genSalt(10, function (err, salt) {
                                            if (err) {                                               
                                                
                                                response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/changepassword",'error in bcrypt salt');
                                                res.json(response);
                                            } else {
                                                bcrypt.hash(newpassword, salt, function (err, hash) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/changepassword",'error in bcrypt hash');
                                                        res.json(response);
                                                    } else {
                                                        connection.query("UPDATE user SET password = '" + hash + "', password_reset_token='' WHERE id = '" + post.admin_id + "'", function (err, data) {
                                                            if (err) {
                                                                console.log("eror",err)
                                                                response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/changepassword",'error in update query');
                                                                res.json(response);
                                                            } else {
                                                                console.log("UPDAFE",err,data)
                                                                if (data.affectedRows > 0) {
                                                                    console.log("IN IF")
                                                                    response = general.response_format(true, messages.PASSWORD_UPDATED, {},connection,post,"admin/user/changepassword",'Password changed successfully');
                                                                    res.json(response);
                                                                } else {
                                                                    console.log("IN ELSE");
                                                                    response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/changepassword",'update query not affected');
                                                                    res.json(response);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        response = general.response_format(false, messages.WRONG_CURRENT_PASSSWORD, {},connection,post,"admin/user/changepassword",'error in select query');
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

router.post('/user/edit-admin-profile',upload.array(),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    response = {};
    console.log('edit-admin-profile:',post);    
    var required_params = ['admin_id', 'user_id','firstName','lastName','phone'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    let update_query = "";   
    let full_name = post.firstName+" "+post.lastName
    if(post.city && post.city.trim()!==""){
        update_query += `,city='${post.city}'`
    }
    if(post.state && post.state.trim()!=="" ){
        update_query += `,state='${post.state}'`
    }
    if(post.zipcode && post.zipcode.trim()!==""){
        update_query += `,zipcode='${post.zipcode}'`
    }    
    if (valid) {        
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});                
                res.json(response);
            } else {
                connection.query(`UPDATE user SET first_name='${post.firstName}',last_name='${post.lastName}',full_name='${full_name}',phone='${post.phone}' ${update_query} WHERE id='${post.user_id}' AND role_id = '1'`, function (err, rows) {
                    if (err) {
                        console.log("err1:",err);
                        response = general.response_format(false, messages.OOPS, {},connection,post,"user/edit-admin-profile",'error in update query');
                        res.json(response);
                        // res.json({ "status": 0, "message": messages.OOPS });
                    } else {           
                        console.log("Rows;",rows);
                                     
                        if (rows.affectedRows > 0) {
                            var user = { user_id: post.user_id };
                            general.get_user_structure_data(req, user, function (result) {
                                if (result.status == 1) {
                                    console.log("#user pic", user,result);                                                                                                                     
                                        console.log("IN IF")
                                        response = general.response_format(true, messages.PROFILE_UPDATED,result.data,connection,post,"user/edit-admin-profile",'Profile Updated successfully');
                                        res.json(response);
                                }else {                                            
                                    response = general.response_format(false, result.message, {},connection,post,"user/edit-admin-profile",'result.status !=1');
                                    res.send(response);
                                }
                            });
                        } else {
                            console.log("IN ELSE");
                            response = general.response_format(false, messages.OOPS, {},connection,post,"user/edit-admin-profile",'update query not affected');
                            res.json(response);
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
})

//API for admin dashboard data
router.post('/user/getadmindashboard', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var response = {};
    var post = req.body;
    console.log("postdata",post)
    var required_params = ['admin_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log("err",err)
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.json(response);
            } else {
                var sql = `SELECT COUNT(*) as total_engineers FROM user WHERE status = 1 AND role_id = 2;
                SELECT COUNT(*) as total_new_engineers_this_month FROM user WHERE status = 1 AND role_id = 2 AND MONTH(NOW())= MONTH(created_date) and YEAR(NOW())= YEAR(created_date);
                SELECT COUNT(*) as total_hired from watchlist_student where status = 10;
                SELECT COUNT(*) as total_hired_this_month from watchlist_student where status = 10 AND MONTH(NOW())= MONTH(offer_confirm_date) and YEAR(NOW())= YEAR(offer_confirm_date);
                SELECT COUNT(*) as total_company_users FROM user WHERE status = 1 AND role_id = 3;
                SELECT COUNT(*) as total_company_users_this_month FROM user WHERE status = 1 AND role_id = 3 AND MONTH(NOW())= MONTH(created_date) and YEAR(NOW())= YEAR(created_date);
                SELECT COUNT(*) as total_pending_mock_interview from student_mock_interview where status = 0;
                SELECT COUNT(*) as total_active_watchlist from company_watchlist where status = 1;
                SELECT COUNT(*) as total_watchlist_closed_this_month from company_watchlist where status = 3 AND MONTH(NOW())= MONTH(created_date) and YEAR(NOW())= YEAR(created_date);`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/getadmindashboard",'error in select query');
                        res.json(response);
                    } else {
                       
                        var data = {
                            total_engineers : (result[0].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[0][0].total_engineers):0,
                            total_new_engineers_this_month : (result[1].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[1][0].total_new_engineers_this_month):0,
                            total_hired : (result[2].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[2][0].total_hired):0,
                            total_hired_this_month : (result[3].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[3][0].total_hired_this_month):0,
                            total_company_users : (result[4].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[4][0].total_company_users):0,
                            total_company_users_this_month : (result[5].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[5][0].total_company_users_this_month):0,
                            total_pending_mock_interview : (result[6].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[6][0].total_pending_mock_interview):0,
                            total_active_watchlist : (result[7].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[7][0].total_active_watchlist):0,
                            total_watchlist_closed_this_month : (result[8].length > 0)?new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[8][0].total_watchlist_closed_this_month):0,
                        }
                        
                            response = general.response_format(true, messages.SUCCESS, data,connection,post,"admin/user/getadmindashboard",'success');
                            res.send(response);
                           
                       
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

//API for get all user listing
router.post('/user/getuser', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage")
    var post = req.body;
    var required_params = ['admin_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/getuser", 'Datebase Connection error');
                res.send(response);
            } else {
                var offset = 0, where_cond = "", order_sql = " ORDER BY id DESC";
                if (post.id && post.id !== null && post.id !== "null") {
                    where_cond += ` AND id = ${post.id}`;
                }
                if (post.keyword && post.keyword !== null) {
                    where_cond += ` AND first_name LIKE '%${post.keyword}%' OR last_name LIKE '%${post.keyword}%' OR email LIKE '%${post.keyword}%' OR phone LIKE '%${post.keyword}%'`;
                }
                if (post.order_by && post.order_by !== null) {
                    order_sql = ` ORDER BY ${post.order_by} ${post.sort}`;
                }
                if (post.page && post.page !== null) {
                    offset = (post.page - 1) * constants.ITEMS_PER_PAGE;
                }
                var count_sql = `SELECT COUNT(*) AS total FROM user WHERE status != ? AND role_id = ? ${where_cond} ${order_sql}`;
                connection.query(count_sql, [2,2], function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getuser", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT * FROM user WHERE status != ? AND role_id = ? ${where_cond} ${order_sql} LIMIT ${offset},${constants.ITEMS_PER_PAGE}`;
                        
                        connection.query(sql, [2,2], function (err, result) {
                            if (err) {
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getuser", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/user/getuser", "User Data Fetched Successfully");
                                res.send(response);
                            }
                        });
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

//functions.verifyTokenAdmin,
router.post('/user/getusernew', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage in new user")
    var post = req.body;
    var required_params = ['admin_id','page_size'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {

        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
        let search_query = "";
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'name'){
                var sort = " ORDER BY u.first_name "+sort_sequence;
            }else if(sort_by == 'email'){
                var sort = " ORDER BY u.email"+sort_sequence;
            }else if(sort_by == 'created_date'){
                var sort = " ORDER BY u.created_date"+sort_sequence;
            }else if(sort_by == 'careerpath'){
                var sort = " ORDER BY cp.career_name"+sort_sequence;
            }else if(sort_by == 'place'){
                var sort = " ORDER BY ct.name"+sort_sequence;
            }else if(sort_by == 'is_verified'){
                var sort = " ORDER BY u.is_verified"+sort_sequence;
            }else if(sort_by == 'last_login_date'){
                var sort = " ORDER BY u.last_login_date"+sort_sequence;
            }else{
                var sort = " ORDER BY "+sort_by+sort_sequence;
            }
            
        }
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let search_query = "u.role_id=2 AND u.status !=2 ";
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    
                    if(post.filtred.name && post.filtred.name != ""){
                        search_query += ` AND (u.first_name LIKE '%${post.filtred.name}%' OR u.last_name LIKE '%${post.filtred.name}%')`;
                    }
                    if(post.filtred.email && post.filtred.email != ""){
                        search_query += ` AND (u.email LIKE '%${post.filtred.email}%')`;
                    }
                    if(post.filtred.careerpath && post.filtred.careerpath != ""){
                        search_query += ` AND (cp.career_name LIKE '%${post.filtred.careerpath}%')`;
                    }
                    if(post.filtred.place && post.filtred.place != ""){
                        search_query += ` AND ct.name LIKE '%${post.filtred.place}%'`;
                    }
                    if(post.filtred.created_date && post.filtred.created_date != ""){
                        var newdateonly = moment(post.filtred.created_date).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.created_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }                        
                    }
                    if(post.filtred.last_login_date && post.filtred.last_login_date != ""){
                        var newdateonly1 = moment(post.filtred.last_login_date).format('YYYY-MM-DD')
                        console.log("newdateonly1",newdateonly1)
                        if(newdateonly1){
                            search_query += ` AND (DATE_FORMAT(u.last_login_date, '%Y-%m-%d') LIKE '%${newdateonly1}%')`;
                        }                        
                    }
                }
                var searchqcount = `SELECT u.*,sd.skills as skills,ct.name as place,cp.career_name as career_name FROM user u
                LEFT JOIN student_details sd ON sd.user_id=u.id 
                LEFT JOIN career_path cp ON cp.id=u.career_path_id
                LEFT JOIN city ct ON ct.id=sd.currently_lived
                WHERE ${search_query}`;
                console.log("searchqcount",searchqcount)
                
                connection.query(searchqcount, function (err, searchqcount) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        var totalrow = searchqcount.length;
                        var searchq = `SELECT CONCAT(u.first_name, ' ', u.last_name) as name,u.first_name,u.last_name,u.id,u.email,u.status,u.created_date,u.phone,u.is_verified,u.is_special_candidate,u.last_login_date,u.racial_identity,u.profile_pic,sd.skills as skills,ct.name as place,cp.career_name as career_name FROM user u
                            LEFT JOIN student_details sd ON sd.user_id=u.id 
                            LEFT JOIN career_path cp ON cp.id=u.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query}  ${sort} LIMIT ${limit}`;
                            console.log("searchq",searchq)
                            var responsedata = []
                            connection.query(searchq, function (err, searchq) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                    res.send(response);
                                } else {
                                    console.log("searchq",searchq)
                                    async.forEachOf(searchq, function (element, key, dataCB) {
                                        
                                        var tempobj = {}
                                        tempobj.id = element.id
                                        tempobj.name = element.name
                                        tempobj.email = element.email
                                        tempobj.career_path = element.career_name
                                        tempobj.place = (element.place)?element.place:''
                                        tempobj.created_date = moment(element.created_date).format("MM/DD/YYYY")
                                        tempobj.status = element.status
                                        tempobj.phone = (element.phone)?element.phone:''
                                        tempobj.first_name = element.first_name
                                        tempobj.last_name = element.last_name
                                        tempobj.is_verified = element.is_verified
                                        tempobj.is_special_candidate = element.is_special_candidate
                                        tempobj.last_login_date = element.last_login_date ? moment(element.last_login_date).format("MM/DD/YYYY") : ''
                                        responsedata.push(tempobj)
                                        tempobj.racial_identity = element.racial_identity ? element.racial_identity : ''
                                        tempobj.profile_pic = (element['profile_pic'])?constants.API_URL+'profile_pic/'+element['profile_pic']:'',
                                        dataCB()
                                        
                                    }, function (err) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                            res.send(response);
                                        } else {
                                            console.log("responsedata",responsedata)
                                            var data = {
                                                total: totalrow,
                                                data: (responsedata.length > 0) ? responsedata : []
                                            };
                                            response = general.response_format(true, messages.SUCCESS, data, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                            res.send(response);
                                        }
                                    });

                                }
                            })

                    }
                })
                    
            }
        })
    } else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);
    }
});
//API for get hired engineers
//functions.verifyTokenAdmin,
router.post('/user/getuserreport', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage in new user")
    var post = req.body;
    var required_params = ['admin_id','page_size'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        if(post.report_type == 1){
            post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
            var page = (post.page)?post.page:0;
            var limit =  post.page_size;
            limit = ((page*post.page_size))+','+(post.page_size)
            let search_query = "";
            var sort = "ORDER BY u.id DESC";

            if(post.sort_param){
                var sort_by = post.sort_param;
                var sort_sequence = (post.order == 1)?" ASC":" DESC";
                if(sort_by == 'name'){
                    var sort = " ORDER BY us.first_name "+sort_sequence;
                }else if(sort_by == 'watchlistname'){
                    var sort = " ORDER BY cw.role_title "+sort_sequence;
                }else if(sort_by == 'intro_discovery_response_on_date'){
                    var sort = " ORDER BY u.offer_date "+sort_sequence;
                }else if(sort_by == 'offer_confirm_date'){
                    var sort = " ORDER BY u.offer_confirm_date "+sort_sequence;
                }else{
                    var sort = " ORDER BY "+sort_by+sort_sequence;
                }
            }
            req.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                    res.send(response);
                } else {
                    let search_query = "u.status = 10";
                    if(post.customfilter && Object.keys(post.customfilter).length > 0){
                        if(post.customfilter.companyid && post.customfilter.companyid >0){
                            console.log("companyfilterdata",post.customfilter.companyid)
                            search_query += ` AND (cus.company_id = '${post.customfilter.companyid}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.interviewfrom && post.customfilter.interviewfrom != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.interviewfrom)
                            search_query += ` AND (DATE_FORMAT(u.offer_date, '%Y-%m-%d') >= '${post.customfilter.interviewfrom}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.interviewto && post.customfilter.interviewto != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.interviewto)
                            search_query += ` AND (DATE_FORMAT(u.offer_date, '%Y-%m-%d') <= '${post.customfilter.interviewto}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.ointerviewfrom && post.customfilter.ointerviewfrom != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.ointerviewfrom)
                            search_query += ` AND (u.offer_confirm_date >= '${post.customfilter.ointerviewfrom}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.ointerviewto && post.customfilter.ointerviewto != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.ointerviewto)
                            search_query += ` AND (u.offer_confirm_date <= '${post.customfilter.ointerviewto}' )`;
                            console.log("search_query",search_query)
                        }
                        
                    }
                    if(post.filtred && Object.keys(post.filtred).length > 0){
                        
                        if(post.filtred.name && post.filtred.name != ""){
                            search_query += ` AND (us.first_name LIKE '%${post.filtred.name}%' OR us.last_name LIKE '%${post.filtred.name}%')`;
                        }
                      
                        if(post.filtred.watchlistname && post.filtred.watchlistname != ""){
                            search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlistname}%')`;
                        }
                        if(post.filtred.intro_discovery_response_on_date && post.filtred.intro_discovery_response_on_date != ""){
                            var newdateonly = moment(post.filtred.intro_discovery_response_on_date).format('YYYY-MM-DD')
                            console.log("newdateonly",newdateonly)
                            if(newdateonly){
                                search_query += ` AND (DATE_FORMAT(u.offer_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                            }
                            
                        }
                        if(post.filtred.offer_confirm_date && post.filtred.offer_confirm_date != ""){
                            var newdateonly = moment(post.filtred.offer_confirm_date).format('YYYY-MM-DD')
                            console.log("newdateonly",newdateonly)
                            if(newdateonly){
                                search_query += ` AND (DATE_FORMAT(u.offer_confirm_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                            }
                            
                        }
                    
                    }
                
                    var searchqcount = `SELECT u.*,cw.role_title,cus.company_id, CONCAT(us.first_name, ' ', us.last_name) as name,us.first_name,us.last_name,us.id as user_id
                        FROM watchlist_student u
                        LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                        LEFT JOIN user us ON us.id=u.student_id 
                        LEFT JOIN user cus ON us.id=u.user_id 
                        WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,cw.role_title,cus.company_id, CONCAT(us.first_name, ' ', us.last_name) as name,us.first_name,us.last_name,us.id as user_ids
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN user cus ON cus.id=u.user_id 
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/report/search", 'Mysql error in search query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        var company = `SELECT id,company_name FROM company ORDER BY company_name ASC`;
                                        connection.query(company, function (err, companydata) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/report/get company", 'Mysql error in get company query');
                                                res.send(response);
                                            } else {
                                        
                                                async.forEachOf(searchq, function (element, key, dataCB) {
                                                    
                                                    var tempobj = {}
                                                
                                                    tempobj.name = element.name
                                                    tempobj.created_date =moment(element.created_date).format("MM/DD/YYYY")
                                                    tempobj.status =element.status
                                                    tempobj.first_name =element.first_name
                                                    tempobj.last_name =element.last_name
                                                    tempobj.id = element.user_ids
                                                    tempobj.watchlistname =element.role_title
                                                    tempobj.company_name =element.company_name
                                                    tempobj.offer_confirm_date = (element.offer_confirm_date)?moment(element.offer_confirm_date).format("MM/DD/YYYY"):''
                                                    tempobj.intro_discovery_response_on_date = (element.offer_date)?moment(element.offer_date).format("MM/DD/YYYY"):''
                                                    
                                                    var getcompany = `SELECT c.* FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${element.user_id}'`;
                                                    connection.query(getcompany, function (err, getcompany) {
                                                        if (err) {
                                                            dataCB(err)
                                                        } else {
                                                        
                                                            tempobj.company_name =( getcompany[0].company_name)? getcompany[0].company_name:''
                                                            responsedata.push(tempobj)
                                                            dataCB()
                                                        }
                                                    })
                                                    
                                                }, function (err) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                        res.send(response);
                                                    } else {
                                                        console.log("responsedata",responsedata)
                                                        var data = {
                                                            company_data: companydata,
                                                            total: totalrow,
                                                            data: (responsedata.length > 0) ? responsedata : []
                                                        };
                                                        response = general.response_format(true, messages.SUCCESS, data, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                                        res.send(response);
                                                    }
                                                });
                                            }
                                        })

                                    }
                                })

                        }
                    })
                        
                }
            })
        }else if(post.report_type == 2)
        {
            post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
            var page = (post.page)?post.page:0;
            var limit =  post.page_size;
            limit = ((page*post.page_size))+','+(post.page_size)
            let search_query = "";
            var sort = "ORDER BY u.id DESC";

            if(post.sort_param){
                var sort_by = post.sort_param;
                var sort_sequence = (post.order == 1)?" ASC":" DESC";
                if(sort_by == 'name'){
                    var sort = " ORDER BY us.first_name "+sort_sequence;
                }else if(sort_by == 'watchlistname'){
                    var sort = " ORDER BY cw.role_title "+sort_sequence;
                }else if(sort_by == 'intro_discovery_response_on_date'){
                    var sort = " ORDER BY u.onsite_interview_date "+sort_sequence;
                }else if(sort_by == 'offer_date'){
                    var sort = " ORDER BY u.offer_date "+sort_sequence;
                }else{
                    var sort = " ORDER BY "+sort_by+sort_sequence;
                }
            }
            req.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                    res.send(response);
                } else {
                    var search_query = "u.status IN(9,11)";
                    if(post.customfilter && Object.keys(post.customfilter).length > 0){
                        if(post.customfilter.statusvalue && post.customfilter.statusvalue >0){
                            console.log("companyfilterdata",post.customfilter.statusvalue)
                            var search_query = "u.status IN("+post.customfilter.statusvalue+")";
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.companyid && post.customfilter.companyid >0){
                            console.log("companyfilterdata",post.customfilter.companyid)
                            search_query += ` AND (cus.company_id = '${post.customfilter.companyid}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.interviewfrom && post.customfilter.interviewfrom != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.interviewfrom)
                            search_query += ` AND (u.onsite_interview_date >= '${post.customfilter.interviewfrom}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.interviewto && post.customfilter.interviewto != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.interviewto)
                            search_query += ` AND (u.onsite_interview_date <= '${post.customfilter.interviewto}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.ointerviewfrom && post.customfilter.ointerviewfrom != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.ointerviewfrom)
                            search_query += ` AND (u.offer_confirm_date >= '${post.customfilter.ointerviewfrom}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.ointerviewto && post.customfilter.ointerviewto != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.ointerviewto)
                            search_query += ` AND (u.offer_confirm_date <= '${post.customfilter.ointerviewto}' )`;
                            console.log("search_query",search_query)
                        }
                        
                    }
                    if(post.filtred && Object.keys(post.filtred).length > 0){
                        
                        if(post.filtred.name && post.filtred.name != ""){
                            search_query += ` AND (us.first_name LIKE '%${post.filtred.name}%' OR us.last_name LIKE '%${post.filtred.name}%')`;
                        }
                      
                        if(post.filtred.watchlistname && post.filtred.watchlistname != ""){
                            search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlistname}%')`;
                        }
                        if(post.filtred.intro_discovery_response_on_date && post.filtred.intro_discovery_response_on_date != ""){
                            var newdateonly = moment(post.filtred.intro_discovery_response_on_date).format('YYYY-MM-DD')
                            console.log("newdateonly",newdateonly)
                            if(newdateonly){
                                search_query += ` AND (DATE_FORMAT(u.general_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                            }
                            
                        }
                        if(post.filtred.offer_date && post.filtred.offer_date != ""){
                            var newdateonly = moment(post.filtred.offer_date).format('YYYY-MM-DD')
                            console.log("newdateonly",newdateonly)
                            if(newdateonly){
                                search_query += ` AND (DATE_FORMAT(u.offer_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                            }
                            
                        }
                    
                    }
                
                    var searchqcount = `SELECT u.*,cw.role_title,cus.company_id, CONCAT(us.first_name, ' ', us.last_name) as name,us.first_name,us.last_name,us.id as user_id
                        FROM watchlist_student u
                        LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                        LEFT JOIN user us ON us.id=u.student_id 
                        LEFT JOIN user cus ON cus.id=u.user_id 
                        WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.general_date, "%m/%d/%Y") as general_date,cw.role_title,cus.company_id, CONCAT(us.first_name, ' ', us.last_name) as name,us.first_name,us.last_name,us.id as user_ids
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN user cus ON cus.id=u.user_id 
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var company = `SELECT id,company_name FROM company ORDER BY company_name ASC`;
                                connection.query(company, function (err, companydata) {
                                    if (err) {
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/report/get company", 'Mysql error in get company query');
                                        res.send(response);
                                    } else {
                                        var responsedata = []
                                        connection.query(searchq, function (err, searchq) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                res.send(response);
                                            } else {
                                                console.log("searchq",searchq)
                                                async.forEachOf(searchq, function (element, key, dataCB) {
                                                    console.log("element",element.final_round_date)
                                                    var tempobj = {}
                                                
                                                    tempobj.name = element.name
                                                    tempobj.created_date =moment(element.created_date).format("MM/DD/YYYY")
                                                    tempobj.status =element.status
                                                    tempobj.first_name =element.first_name
                                                    tempobj.last_name =element.last_name
                                                    tempobj.id = element.user_ids
                                                    tempobj.watchlistname =element.role_title
                                                
                                                    tempobj.is_offer_sent = (element.status==11)?1:0
                                                    tempobj.offer_date = (element.offer_date)?moment(element.offer_date).format("MM/DD/YYYY"):''
                                                    tempobj.intro_discovery_response_on_date = (element.general_date)?moment(element.general_date).format("MM/DD/YYYY"):''
                                                    var getcompany = `SELECT c.* FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${element.user_id}'`;
                                                    connection.query(getcompany, function (err, getcompany) {
                                                        if (err) {
                                                            dataCB(err)
                                                        } else {
                                                        
                                                            tempobj.company_name =( getcompany[0].company_name)? getcompany[0].company_name:''
                                                            responsedata.push(tempobj)
                                                            dataCB()
                                                        }
                                                    })
                                                    
                                                    
                                                }, function (err) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                        res.send(response);
                                                    } else {
                                                        console.log("responsedata",responsedata)
                                                        var data = {
                                                            company_data: companydata,
                                                            total: totalrow,
                                                            data: (responsedata.length > 0) ? responsedata : []
                                                        };
                                                        response = general.response_format(true, messages.SUCCESS, data, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                                        res.send(response);
                                                    }
                                                });

                                            }
                                        })
                                    }
                                })
                                

                        }
                    })
                        
                }
            })
        }else if(post.report_type == 3)
        {
            post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
            var page = (post.page)?post.page:0;
            var limit =  post.page_size;
            limit = ((page*post.page_size))+','+(post.page_size)
            let search_query = "";
            var sort = "ORDER BY u.id DESC";

            if(post.sort_param){
                var sort_by = post.sort_param;
                var sort_sequence = (post.order == 1)?" ASC":" DESC";
                if(sort_by == 'name'){
                    var sort = " ORDER BY us.first_name "+sort_sequence;
                }else if(sort_by == 'watchlistname'){
                    var sort = " ORDER BY cw.role_title "+sort_sequence;
                }else if(sort_by == 'intro_discovery_response_on_date'){
                    var sort = " ORDER BY u.onsite_interview_date "+sort_sequence;
                }else if(sort_by == 'offer_date'){
                    var sort = " ORDER BY u.offer_date "+sort_sequence;
                }else{
                    var sort = " ORDER BY "+sort_by+sort_sequence;
                }
            }
            req.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                    res.send(response);
                } else {
                    var search_query = "u.status IN(4,5,6,7,8,13)";
                    if(post.customfilter && Object.keys(post.customfilter).length > 0){
                        if(post.customfilter.statusvalue && post.customfilter.statusvalue != ''){
                            if(post.customfilter.statusvalue == 1)//pass
                            {
                                var search_query = "u.status IN(6,8)";
                            }else{
                                var search_query = "u.status IN(5,7,13)";
                            }
                            if(post.customfilter.roundvalue && post.customfilter.roundvalue != ''){
                                if(post.customfilter.roundvalue == 1)//intro
                                {
                                    if(post.customfilter.statusvalue && post.customfilter.statusvalue != '' && post.customfilter.statusvalue == 1){
                                        var search_query = "u.status IN(6)";
                                    }else if(post.customfilter.statusvalue && post.customfilter.statusvalue != '' && post.customfilter.statusvalue == 0){
                                        var search_query = "u.status IN(5)";
                                    }
                                    
                                } else if(post.customfilter.roundvalue == 2)//intro
                                {
                                    if(post.customfilter.statusvalue && post.customfilter.statusvalue != '' && post.customfilter.statusvalue == 1){
                                        var search_query = "u.status IN(8)";
                                    }else if(post.customfilter.statusvalue && post.customfilter.statusvalue != '' && post.customfilter.statusvalue == 0){
                                        var search_query = "u.status IN(7)";
                                    }
                                    
                                }else{
                                   
                                    if(post.customfilter.statusvalue && post.customfilter.statusvalue != '' && post.customfilter.statusvalue == 1){
                                        var search_query = "u.status IN(14)";
                                    }else if(post.customfilter.statusvalue && post.customfilter.statusvalue != '' && post.customfilter.statusvalue == 0){
                                        var search_query = "u.status IN(13)";
                                    }
                                }
                               
                                console.log("search_query",search_query)
                            }
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.roundvalue && post.customfilter.roundvalue != ''){
                            if(post.customfilter.roundvalue == 1)//intro
                            {
                                var search_query = "u.status IN(4,5)";
                            }else if(post.customfilter.roundvalue == 2)//intro
                            {
                                var search_query = "u.status IN(7,6)";
                            }else{
                                var search_query = "u.status IN(13,8)";
                            }
                           
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.companyid && post.customfilter.companyid >0){
                            console.log("companyfilterdata",post.customfilter.companyid)
                            search_query += ` AND (cus.company_id = '${post.customfilter.companyid}' )`;
                            console.log("search_query",search_query)
                        }
                        if(post.customfilter.interviewfrom && post.customfilter.interviewfrom != 'Invalid date'){
                            if(post.customfilter.roundvalue && post.customfilter.roundvalue != '' && post.customfilter.roundvalue == 1){
                                search_query += ` AND (u.intro_discovery_confirm_on_date >= '${post.customfilter.interviewfrom}' )`;
                            }else if(post.customfilter.roundvalue && post.customfilter.roundvalue != '' && post.customfilter.roundvalue == 2){
                                search_query += ` AND (u.onsite_interview_date >= '${post.customfilter.interviewfrom}' )`;
                            }else{
                                search_query += ` AND (u.final_round_date >= '${post.customfilter.interviewfrom}' )`;
                            }
                        }
                        if(post.customfilter.interviewto && post.customfilter.interviewto != 'Invalid date'){
                            console.log("companyfilterdata",post.customfilter.interviewto)
                            
                            if(post.customfilter.roundvalue && post.customfilter.roundvalue != '' && post.customfilter.roundvalue == 1){
                                search_query += ` AND (u.intro_discovery_confirm_on_date <= '${post.customfilter.interviewto}' )`;
                            }else if(post.customfilter.roundvalue && post.customfilter.roundvalue != '' && post.customfilter.roundvalue == 2){
                                search_query += ` AND (u.onsite_interview_date <= '${post.customfilter.interviewto}' )`;
                            }else{
                                search_query += ` AND (u.final_round_date <= '${post.customfilter.interviewto}' )`;
                            }
                        }
                        
                        
                    }
                    if(post.filtred && Object.keys(post.filtred).length > 0){
                        
                        if(post.filtred.name && post.filtred.name != ""){
                            search_query += ` AND (us.first_name LIKE '%${post.filtred.name}%' OR us.last_name LIKE '%${post.filtred.name}%')`;
                        }
                      
                        if(post.filtred.watchlistname && post.filtred.watchlistname != ""){
                            search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlistname}%')`;
                        }
                        if(post.filtred.intro_discovery_response_on_date && post.filtred.intro_discovery_response_on_date != ""){
                            var newdateonly = moment(post.filtred.intro_discovery_response_on_date).format('YYYY-MM-DD')
                            console.log("newdateonly",newdateonly)
                            if(newdateonly){
                                search_query += ` AND (DATE_FORMAT(u.final_round_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                            }
                            
                        }
                        if(post.filtred.offer_date && post.filtred.offer_date != ""){
                            var newdateonly = moment(post.filtred.offer_date).format('YYYY-MM-DD')
                            console.log("newdateonly",newdateonly)
                            if(newdateonly){
                                search_query += ` AND (DATE_FORMAT(u.offer_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                            }
                            
                        }
                    
                    }
                
                    var searchqcount = `SELECT u.*,cw.role_title,cus.company_id, CONCAT(us.first_name, ' ', us.last_name) as name,us.first_name,us.last_name,us.id as user_id
                        FROM watchlist_student u
                        LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                        LEFT JOIN user us ON us.id=u.student_id 
                        LEFT JOIN user cus ON cus.id=u.user_id 
                        WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.intro_discovery_confirm_on_date, "%m/%d/%Y") as intro_discovery_confirm_on_date,DATE_FORMAT(u.onsite_interview_date, "%m/%d/%Y") as onsite_interview_date,DATE_FORMAT(u.final_round_date, "%m/%d/%Y") as final_round_date,cw.role_title,cus.company_id, CONCAT(us.first_name, ' ', us.last_name) as name,us.first_name,us.last_name,us.id as user_ids
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN user cus ON cus.id=u.user_id 
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var company = `SELECT id,company_name FROM company ORDER BY company_name ASC`;
                                connection.query(company, function (err, companydata) {
                                    if (err) {
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/report/get company", 'Mysql error in get company query');
                                        res.send(response);
                                    } else {
                                        var responsedata = []
                                        connection.query(searchq, function (err, searchq) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                res.send(response);
                                            } else {
                                                console.log("searchq",searchq)
                                                async.forEachOf(searchq, function (element, key, dataCB) {
                                                    var atplace = ""
                                                    var interviewstatus = "Pending"
                                                    var interviewdate = ""
                                                    if(element.status == 4 || element.status == 5){
                                                        interviewdate = (element.intro_discovery_confirm_on_date)?moment(element.intro_discovery_confirm_on_date).format("MM/DD/YYYY"):''
                                                        atplace = "Intro Round"
                                                        if(element.status == 5){
                                                            interviewstatus = "Fail"
                                                        }else if(element.status == 6){
                                                            interviewstatus = "Pass"
                                                        }
                                                    }else if(element.status == 7 || element.status == 6 ){
                                                        interviewdate = (element.onsite_interview_date)?moment(element.onsite_interview_date).format("MM/DD/YYYY"):''
                                                        atplace = "Onsite Round"
                                                        if(element.status == 7){
                                                            interviewstatus = "Fail"
                                                        }else if(element.status == 6){
                                                            interviewstatus = "Pending"
                                                        }
                                                    }else if(element.status == 13 || element.status == 8 ){
                                                        interviewdate = (element.final_round_date)?moment(element.final_round_date).format("MM/DD/YYYY"):''
                                                        atplace = "Final Round"
                                                        if(element.status == 13){
                                                            interviewstatus = "Fail"
                                                        }else if(element.status == 8){
                                                            interviewstatus = "Pending"
                                                        }
                                                    }else{
                                                        interviewdate = (element.final_round_date)?moment(element.final_round_date).format("MM/DD/YYYY"):''
                                                        atplace = "Final Round"
                                                        if(element.status == 13){
                                                            interviewstatus = "Fail"
                                                        }else if(element.status == 14){
                                                            interviewstatus = "Pass"
                                                        }
                                                    }
                                                
                                                    var tempobj = {}
                                                
                                                    tempobj.name = element.name
                                                    tempobj.created_date =moment(element.created_date).format("MM/DD/YYYY")
                                                    tempobj.status =element.status
                                                    tempobj.first_name =element.first_name
                                                    tempobj.last_name =element.last_name
                                                    tempobj.id = element.user_ids
                                                    tempobj.watchlistname =element.role_title
                                                    tempobj.atplace = atplace
                                                    tempobj.interviewstatus = interviewstatus
                                                    tempobj.is_offer_sent = (element.status==9)?1:0
                                                    tempobj.offer_date = (element.offer_date)?moment(element.offer_date).format("MM/DD/YYYY"):''
                                                    tempobj.intro_discovery_response_on_date = interviewdate
                                                    var getcompany = `SELECT c.* FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${element.user_id}'`;
                                                    connection.query(getcompany, function (err, getcompany) {
                                                        if (err) {
                                                            dataCB(err)
                                                        } else {
                                                        
                                                            tempobj.company_name =( getcompany[0].company_name)? getcompany[0].company_name:''
                                                            responsedata.push(tempobj)
                                                            dataCB()
                                                        }
                                                    })
                                                    
                                                    
                                                }, function (err) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                        res.send(response);
                                                    } else {
                                                        console.log("responsedata",responsedata)
                                                        var data = {
                                                            company_data: companydata,
                                                            total: totalrow,
                                                            data: (responsedata.length > 0) ? responsedata : []
                                                        };
                                                        response = general.response_format(true, messages.SUCCESS, data, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                                        res.send(response);
                                                    }
                                                });

                                            }
                                        })
                                    }
                                })
                                

                        }
                    })
                        
                }
            })
        }
        
    } else {
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);
    }
});
//API for change user status
router.post('/user/changestatus', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/changestatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE user SET status = ? WHERE id = ?";
                connection.query(sql, [post.status, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/changestatus", 'Error in update query');
                        res.send(response);
                    } else {
                        var message = (post.status == 1) ? 'User Activated Successfully' : (post.status == 0) ? 'User Deactivated Successfully' : 'User Deleted Successfully'
                        response = general.response_format(true, message, {}, connection, post, "admin/user/changestatus", "User status changed successfully");
                        res.send(response);
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
//API for change user as special candidate
router.post('/user/changespecialcandidate', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'special_candidate'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/changespecialcandidate", 'Datebase Connection error');
                res.send(response);
            } else {
                var getstudent = `SELECT * FROM user WHERE id = ${post.id};`
                connection.query(getstudent, function (err, getstudent) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/changespecialcandidate", 'Mysql error in check user query');
                        res.send(response);
                    } else {
                        if(getstudent[0].is_verified) {
                            var sql = "UPDATE user SET is_special_candidate = ? WHERE id = ?";
                            connection.query(sql, [post.special_candidate, post.id], function (err, updateres) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/changespecialcandidate", 'Error in update query');
                                    res.send(response);
                                } else {
                                    var message = 'User Advance Candidate Successfully'
                                    response = general.response_format(true, message, {}, connection, post, "admin/user/changespecialcandidate", "User Advance Candidate Successfully");
                                    res.send(response);
                                }
                            });
                        } else {
                            response = general.response_format(false, "User email are not verified", {}, connection, post, "admin/user/changespecialcandidate", 'User email are not verified');
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
//api user for update user 
router.post('/user/updateuser', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'id', 'first_name','last_name','phone','racial_identity'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    // console.log("#", req.files.profile_pic);
    if(valid){
        var id = post.id;
        var phone = post.phone;
       
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/updateuser", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkphone = "SELECT * FROM user WHERE (phone = '" + phone + "' ) AND status!='2' AND id != '" + id + "' "; 
                connection.query(checkphone, function (err, phoneresponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updateuser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (phoneresponse.length > 0) {
                            response = general.response_format(false, messages.PHONE_EXIST, {}, connection, post, "admin/user/updateuser", 'Phone already registered with another user');
                            res.send(response);
                        } else {
                            var newpassword = (post.password.trim())?post.password:'123456'
                           // $2a$10$9mQKJD2VK/XcICTMeCjaSeO1EErhzQNw8sjEJsMaFD6YTaIb9ne0W
                            bcrypt.genSalt(10, function (err, salt) {
                                    if (err) {                                               
                                        
                                        response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/updateuser",'error in bcrypt salt');
                                        res.json(response);
                                    } else {
                                        bcrypt.hash(newpassword, salt, function (err, hash) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {},connection,post,"admin/user/updateuser",'error in bcrypt hash');
                                                res.json(response);
                                            } else {
                                                //detail data
                                                var checkdetails = "SELECT * FROM user WHERE id = '" + post.id + "' ";
                                                connection.query(checkdetails, function (err, checkdetailsdata) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updateuser", 'Mysql error in check phone query');
                                                        res.json(response);
                                                    } else {
                                                        let update_profile = "";                            
                                                        if(req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename){
                                                            update_profile+=',profile_pic = ?'                     
                                                        }

                                                        if(post.password.trim()){
                                                            var sql = `UPDATE user SET first_name = ?,last_name = ?,password=?, phone = ?, racial_identity = ?, modified_date = ? ${update_profile} WHERE id = ${id}`;
                                                            var values = [post.first_name, post.last_name,hash, post.phone, post.racial_identity, created_date]
                                                            
                                                        }else{
                                                            var sql = `UPDATE user SET first_name = ?,last_name = ?, phone = ?, racial_identity = ?, modified_date = ? ${update_profile} WHERE id = ${id}`;
                                                            var values = [post.first_name, post.last_name, post.phone, post.racial_identity, created_date]
                                                        
                                                        }

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

                                                        connection.query(sql,values, function (err, rowsdata) {
                                                            if (err) {
                                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updateuser", 'Mysql error in update user query');
                                                                res.send(response);
                                                            }  else {
                                                                response = general.response_format(true, messages.PROFILE_UPDATED, {}, connection, post, "admin/user/updateuser", "profile updated successfully");
                                                                res.send(response);
                                                            }
                                                        })
                                                    }
                                                });

                                            }
                                        })
                                    }
                                })

                        }
                    }
                })
            }
        });
                
                
          
    } else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);   
    }
});

//api user for Add user 
router.post('/user/adduser-bkp',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'first_name','last_name','phone','email','password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        
        var phone_data = functions.validateNumber(post.phone);
        var phone_international = phone_data.international_phone;
        var phone_national = phone_data.national_phone;
        var phone_e164 = phone_data.E164_phone;
        var phone = phone_data.number;
        var country_code = phone_data.country_code;
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/adduser", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkphone = "SELECT * FROM user WHERE (email = BINARY '" + post.email + "' OR phone = '" + phone + "' OR phone_international = '" + phone_international + "' OR phone_national = '" + phone_national + "' OR phone_e164 = '" + phone_e164 + "') AND status!='2' "; 
                connection.query(checkphone, function (err, checkemail) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (checkemail.length > 0) {
                            var msg = "";
                            
                            if ((checkemail[0].phone === post.phone || checkemail[0].phone_international === post.phone || checkemail[0].phone_national === post.phone || checkemail[0].phone_e164 === post.phone) && (checkemail[0].email === post.email)) {
                                console.log("testest")
                                var msg = "Email and Phone number already exist";
                            } else if (checkemail[0].email === post.email) {
                                console.log("testest22")
                                var msg = "Email already exist";
                            }
                            else if (checkemail[0].phone === post.phone || checkemail[0].phone_international === post.phone || checkemail[0].phone_national === post.phone || checkemail[0].phone_e164 === post.phone) {
                                console.log("testest333")
                                var msg = "Phone number already exist";
                            }
                            response = general.response_format(false, msg, {}, connection, post, "admin/user/adduser", msg);
                            res.send(response);
                        } else {

                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                    res.send(response);
                                } else {
                                    bcrypt.hash(post.password, salt, function (err, hash) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                            res.send(response);
                                        } else {
                                            var sql = `INSERT INTO user (full_name,first_name,last_name,email,phone,password,is_verified,role_id,phone_international,phone_national,phone_e164,created_by,created_date) VALUES ?`;
                                            var values = [
                                                [
                                                    [post.first_name+' '+post.last_name,post.first_name, post.last_name,post.email,post.phone,hash,1,2,phone_international, phone_national, phone_e164,post.admin_id,created_date]
                                                ]
                                            ];
                                            connection.query(sql,values, function (err, rowsdata) {
                                                if (err) {
                                                    console.log(err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in create user query');
                                                    res.send(response);
                                                }  else {
                                                    response = general.response_format(true, messages.USER_CREATED, {}, connection, post, "admin/user/adduser", "user created successfully");
                                                    res.send(response);
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
    } else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);   
    }
});

//api user for Add user 
router.post('/user/adduser',multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'first_name','last_name','career_path_id','phone','email','password', 'racial_identity'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        var phone = post.phone;

        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/adduser", 'Datebase Connection error');
                res.send(response);
            } else{                
                var checkphone = "SELECT * FROM user WHERE (email = '" + post.email + "' OR phone = '" + phone + "') AND status!='2' "; 
                connection.query(checkphone, function (err, checkemail) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (checkemail.length > 0) {
                            var msg = "";
                            
                            if ((checkemail[0].phone === post.phone) && (checkemail[0].email === post.email)) {
                                console.log("testest")
                                var msg = "Email and Phone number already exist";
                            } else if (checkemail[0].email === post.email) {
                                console.log("testest22")
                                var msg = "Email already exist";
                            }
                            else if (checkemail[0].phone === post.phone) {
                                console.log("testest333")
                                var msg = "Phone number already exist";
                            }
                            response = general.response_format(false, msg, {}, connection, post, "admin/user/adduser", msg);
                            res.send(response);
                        } else {

                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                    res.send(response);
                                } else {
                                    bcrypt.hash(post.password, salt, function (err, hash) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                            res.send(response);
                                        } else {
                                            var user_verifytoken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                            if(req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename){
                                                var sql = `INSERT INTO user (full_name,first_name,last_name,career_path_id,racial_identity,email,phone,profile_pic,password,auth_key,is_verified,email_verify_time,is_password_changed,role_id,looking_for_job,created_by,created_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.first_name+' '+post.last_name,post.first_name, post.last_name,post.career_path_id,post.racial_identity,post.email,post.phone,req.files.profile_pic[0].filename,hash,user_verifytoken,0,created_date,constants.IS_PASSWORD_CHANGED,2,1,post.admin_id,created_date]
                                                    ]
                                                ];    
                                            } else {
                                                var sql = `INSERT INTO user (full_name,first_name,last_name,career_path_id,racial_identity,email,phone,password,auth_key,is_verified,email_verify_time,is_password_changed,role_id,looking_for_job,created_by,created_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.first_name+' '+post.last_name,post.first_name, post.last_name,post.career_path_id,post.racial_identity,post.email,post.phone,hash,user_verifytoken,0,created_date,constants.IS_PASSWORD_CHANGED,2,1,post.admin_id,created_date]
                                                    ]
                                                ];
                                            }
                                            
                                            connection.query(sql,values, function (err, rowsdata) {
                                                if (err) {
                                                    console.log(err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in create user query');
                                                    res.send(response);
                                                }  else {
                                                    var user_id = rowsdata.insertId;
                                                    var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 22; ";
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.ERROR_PROCESSING, {}, connection, post, "admin/user/adduser", 'email_template err');
                                                            res.send(response);
                                                        } else {
                                                            var career_path_listing_query = `SELECT * FROM skills WHERE career_path_id='${post.career_path_id}' and is_default_skill='1'`;
                                                            connection.query(career_path_listing_query,(err,skills)=>{
                                                                if(err){
                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in select default skill query');
                                                                    res.send(response);
                                                                }else{
                                                                    let default_skill_id = 0; 
                                                                    let is_default = 0;
                                                                    console.log("Skills",skills);

                                                                    if(skills.length > 0){
                                                                        default_skill_id = skills[0].id;
                                                                        is_default = skills[0].is_default_skill
                                                                    }
                                                                    let created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                                                    connection.query(`INSERT INTO student_skill(user_id,skill_id,is_default_skill,skill_exam_status,created_date) VALUES ('${user_id}','${default_skill_id}','${is_default}','0','${created_date}')`,(err,insertedSkill)=>{
                                                                        if(err){
                                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in insert default skill  query');
                                                                            res.send(response);
                                                                        }else{
                                                                            var html = email_template[0].emailtemplate_body;
                                                                            var html = html.replace(/{first_name}/gi, (post.first_name) ? post.first_name : '');
                                                                            var html = html.replace(/{last_name}/gi, (post.last_name) ? post.last_name : '');
                                                                            var html = html.replace(/{userpassword}/gi, (post.password) ? post.password : '');
                                                                            var html = html.replace(/{useremail}/gi, (post.email) ? post.email : '');
                                                                            var html = html.replace(/{link}/gi, constants.APP_URL + "confirm/emailverify/" + user_verifytoken + " ");
                                                                            var data = { to: post.email, subject: email_template[0].emailtemplate_subject, html: html };
                                                                            console.log("mail call", data)
                                                                            emailservice.sendMailnew(req, data, function (result) {
                                                                                console.log("result", result)
                                                                            });

                                                                            response = general.response_format(true, messages.USER_CREATED, {}, connection, post, "admin/user/adduser", "user created successfully");
                                                                            res.send(response);
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })                                                    
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
});

// api user for Update user details data
router.post('/user/update_specsheet', multerUpload.fields([{ 'name': 'profile_pic' }, { 'name': 'resume' }, { 'name': 'certification' }]), functions.verifyTokenAdmin, (req, res) => {

    let response = {};
    var post = req.body;
    console.log("#", post, req.files.resume, req.files.certification);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['admin_id', 'id','experience_level','currently_lived','employment_type','interested_remortely','skills'];
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
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/update_specsheet", "error in create transaction connection");
                        res.send(response); 
                    }else{
                        async.waterfall([
                            function(callback) {
                                //detail data
                                var checkdetails = "SELECT * FROM student_details WHERE user_id = '" + post.id + "' ";
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
                                            var sql = `UPDATE student_details SET experience_level = ?,currently_lived = ?,employment_type = ?, interested_remortely = ?, willing_to_works = ?, looking_for_role = ?, skills = ?, bio=?, anything_else_details=?, github_url=?, linkedin_url=?, website_url=?, updated_date=? ${update_specsheet} WHERE user_id = ${post.id}`;
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
                                                        [post.id,post.experience_level, post.currently_lived, post.employment_type, post.interested_remortely,post.willing_to_works,post.looking_for_role,post.skills,post.bio,post.anything_else_details,req.files.resume[0].filename,post.github_url,post.linkedin_url,post.website_url, created_date]
                                                    ]
                                                ];
                                            } else {
                                                var sql = `INSERT INTO student_details (user_id,experience_level,currently_lived,employment_type,interested_remortely,willing_to_works,looking_for_role,skills,bio,anything_else_details,github_url,linkedin_url,website_url,updated_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.id,post.experience_level, post.currently_lived, post.employment_type, post.interested_remortely,post.willing_to_works,post.looking_for_role,post.skills,post.bio,post.anything_else_details,post.github_url,post.linkedin_url,post.website_url, created_date]
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
                               
                                var checkdetails = "DELETE FROM student_work_history WHERE user_id = '" + post.id + "' ";
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
                                                        [post.id,element.company_name, element.job_title, element.description, startdate, enddate, is_present]
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
                               
                                var checkdetails = "DELETE FROM student_education WHERE user_id = '" + post.id + "' ";
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
                                                        [post.id,element.institution_name, element.degree_name, element.description, startdate, enddate, is_present]
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

                                        var sql = `DELETE FROM student_attachment WHERE user_id=${post.id} AND id=${element.id}`;
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
                                                [post.id,element.filename]
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
                                var sql = "UPDATE user SET is_spec_sheet_added = 1 WHERE id = " + post.id;
                                
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
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/update_specsheet", "error admin/user/update_specsheet");
                                    res.send(response);
                                })  
                            }else{
                                connection.commit((err)=>{
                                    if(err){
                                        connection.rollback(()=>{
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/update_specsheet", "Error in commit transaction while specisheet data insert");
                                            res.send(response);
                                        })
                                    }else{
                                        
                                        response = general.response_format(true,messages.SUCCESS, {}, connection, post, "admin/user/update_specsheet", "Specsheet data added successfully");
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

/********************************* */
//Company user start
/*********************************** */
//functions.verifyTokenAdmin,
router.post('/user/getcusernew', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage in new user")
    var post = req.body;
    var required_params = ['admin_id','page_size'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {

        var page = post.page;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
        let search_query = "";
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            
            
            if(sort_by == "company_name"){
                var sort = " ORDER BY c."+sort_by+sort_sequence;
            }else if(sort_by == 'created_date'){
                var sort = " ORDER BY u.created_date"+sort_sequence;
            }else if(sort_by == 'company_user_role'){
                var sort = " ORDER BY u.company_user_role"+sort_sequence;
            }else if(sort_by == 'full_name'){
                var sort = " ORDER BY u.full_name"+sort_sequence;
            }else{
                var sort = " ORDER BY "+sort_by+sort_sequence;
            }
        }
        if(post.filtred && Object.keys(post.filtred).length > 0){
            if(post.filtred.full_name && post.filtred.full_name != ""){
             
                search_query += ` AND (u.full_name like '%${post.filtred.full_name}%')`;
            }
            if(post.filtred.company_user_role && post.filtred.company_user_role != ""){
             
                search_query += ` AND (u.company_user_role like '%${post.filtred.company_user_role}%')`;
            }
            if(post.filtred.company_name && post.filtred.company_name != ""){
             
                search_query += ` AND (c.company_name like '%${post.filtred.company_name}%')`;
            }
            if(post.filtred.created_date && post.filtred.created_date != ""){
                var newdateonly = moment(post.filtred.created_date).format('YYYY-MM-DD')
                console.log("newdateonly",newdateonly)
                if(newdateonly){
                    search_query += ` AND (DATE_FORMAT(u.created_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                }
                
            }
        }
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/getuser", 'Datebase Connection error');
                res.send(response);
            } else {
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND id = ${post.id}`;
                }
                var count_sql = `SELECT u.id,u.status,DATE_FORMAT(u.created_date, "%m-%d-%Y") as created_date,u.email,u.full_name,u.company_user_role,
                c.company_name,c.company_email,c.company_website
                FROM user u 
                LEFT JOIN company c ON c.id=u.company_id
                WHERE u.status != 2 
                AND u.role_id = 3 ${search_query} `;
                connection.query(count_sql, function (err, rows) {
                   console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getuser", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT u.id,u.status,DATE_FORMAT(u.created_date, "%m/%d/%Y") as created_date,u.email,u.full_name,u.company_user_role,
                        c.company_name,c.company_email,c.company_website
                        FROM user u 
                        LEFT JOIN company c ON c.id=u.company_id
                        WHERE u.status != 2 
                        AND u.role_id = 3 ${search_query} ${sort} LIMIT ${limit};
                        SELECT * from company where status=1`;
                        
                        connection.query(sql, function (err, result) {
                            console.log(this.sql)
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getuser", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                console.log("result",result)
                                var data = {
                                    total: (rows.length > 0) ? rows.length : 0,
                                    data: (result[0].length > 0) ? result[0] : [],
                                    company: (result[1].length > 0) ? result[1] : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/user/getuser", "User Data Fetched Successfully");
                                res.send(response);
                            }
                        });
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
//API for change user status
router.post('/user/changecstatus', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/changestatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE user SET status = ? WHERE id = ?";
                connection.query(sql, [post.status, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/changestatus", 'Error in update query');
                        res.send(response);
                    } else {
                        var message = (post.status == 1) ? 'User Activated Successfully' : (post.status == 0) ? 'User Deactivated Successfully' : 'User Deleted Successfully'
                        response = general.response_format(true, message, {}, connection, post, "admin/user/changestatus", "User status changed successfully");
                        res.send(response);
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
//api user for update user 
router.post('/user/updatecuser',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'id', 'first_name','last_name','phone'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        var id = post.id;
        var phone_data = functions.validateNumber(post.phone);
        var phone_international = phone_data.international_phone;
        var phone_national = phone_data.national_phone;
        var phone_e164 = phone_data.E164_phone;
        var phone = phone_data.number;
        var country_code = phone_data.country_code;
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/updateuser", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkphone = "SELECT * FROM user WHERE (phone = '" + phone + "' OR phone_international = '" + phone_international + "' OR phone_national = '" + phone_national + "' OR phone_e164 = '" + phone_e164 + "') AND status!='2' AND id != '" + id + "' "; 
                connection.query(checkphone, function (err, phoneresponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updateuser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (phoneresponse.length > 0) {
                            response = general.response_format(false, messages.PHONE_EXIST, {}, connection, post, "admin/user/updateuser", 'Phone already registered with another user');
                            res.send(response);
                        } else {
                            var sql = "UPDATE user SET first_name = ?,last_name = ?, phone = ?, phone_international= ?, phone_national= ?, phone_e164= ?,modified_date = ? WHERE id = ? ";
                            var values = [post.first_name, post.last_name, post.phone, phone_international, phone_national, phone_e164, created_date, id]
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updateuser", 'Mysql error in update user query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, messages.PROFILE_UPDATED, {}, connection, post, "admin/user/updateuser", "profile updated successfully");
                                    res.send(response);
                                }
                            })
                        }
                    }
                })
            }
        });
    } else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);   
    }
});

//api user for Add user 
router.post('/user/addcuser',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
console.log(post)
if(post.isedit){
    var required_params = ['admin_id','id', 'cfull_name','crole','cemail','scompany_name','scompany_email','scompany_website'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        var password = (post.cpassword)?post.cpassword:'testpass'
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/adduser", 'Datebase Connection error');
                res.send(response);
            } else{
                var getuser = "SELECT * FROM user WHERE  id = '" + post.id + "' "; 
                connection.query(getuser, function (err, getuser) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (getuser.length > 0) {
                            var checkemail = "SELECT * FROM user WHERE (email = '" + post.cemail + "') AND status!='2' AND id != '" + post.id + "' "; 
                            connection.query(checkemail, function (err, checkemail) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                                    res.send(response);
                                } else {
                                    if (checkemail.length > 0) {
                                        response = general.response_format(false, 'User email already exist', {}, connection, post, "admin/user/adduser", msg);
                                        res.send(response);
                                    }else{
                                        //go ahead
                                        var checkemail = "SELECT * FROM company WHERE (company_email = '" + post.company_email + "') AND status!='2' AND id != '" + getuser[0].company_id + "' "; 
                                        connection.query(checkemail, function (err, checkemail) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                                                res.send(response);
                                            } else {
                                                if (checkemail.length > 0) {
                                                    response = general.response_format(false, 'Company email already exist', {}, connection, post, "admin/user/adduser", msg);
                                                    res.send(response);
                                                }else{
                                                    bcrypt.genSalt(10, function (err, salt) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                                            res.send(response);
                                                        } else {
                                                            bcrypt.hash(password, salt, function (err, hash) {
                                                                if (err) {
                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                                                    res.send(response);
                                                                } else {
                                                                    let update_profile = "";
                                                    
                                                                    if(post.cpassword){
                                                                        update_profile+=',password = ?'                     
                                                                    }
                                                                
                                                                    var sql = `UPDATE user SET full_name = ?,company_user_role = ?,email = ?, modified_date = ? ${update_profile} WHERE id = ${post.id}`;
                                                                    var values = [post.cfull_name, post.crole, post.cemail, created_date]
                                                                    if(post.cpassword){
                                                                        values.push(hash)
                                                                    }
                                                                    connection.query(sql, values, function (err, response) {
                                                                        if (err) {
                                                                            console.log(err)
                                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in update query');
                                                                            res.send(response);
                                                                        } else {
                                                                            var sql = `UPDATE company SET company_name = ?,company_email = ?,company_website = ?, updated_date = ? WHERE id = ${getuser[0].company_id}`;
                                                                            var values = [post.scompany_name, post.scompany_email, post.scompany_website, created_date]
                                                                           
                                                                            connection.query(sql, values, function (err, response) {
                                                                                if (err) {
                                                                                    console.log(err)
                                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in update query');
                                                                                    res.send(response);
                                                                                } else {
                                                                                    response = general.response_format(true, "User updated successfully", {}, connection, post, "front/student/updateprofile", 'profile update success');
                                                                                    res.send(response);
                                                                                }
                                                                            })
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
                                }
                            })

                        }else{
                            response = general.response_format(false, messages.USER_NOT_FOUND, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                            res.send(response);
                        }
                    }
                })
                
            }
        })

    }else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response); 
    }
}else{
    //dd new user
    var required_params = ['admin_id','cfull_name','crole','cemail','scompany_name','scompany_email','scompany_website','cpassword'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        var password = (post.cpassword)?post.cpassword:'testpass'
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/adduser", 'Datebase Connection error');
                res.send(response);
            } else{
                if(post.company_id && post.company_id > 0){
                    var checkemail = "SELECT * FROM user WHERE (email = '" + post.cemail + "') AND status!='2'"; 
                    connection.query(checkemail, function (err, checkemail) {
                        if (err) {
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            if (checkemail.length > 0) {
                                response = general.response_format(false, 'User email already exist', {}, connection, post, "admin/user/adduser", msg);
                                res.send(response);
                            }else{
                                //go ahead
                                bcrypt.genSalt(10, function (err, salt) {
                                    if (err) {
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                        res.send(response);
                                    } else {
                                        bcrypt.hash(password, salt, function (err, hash) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                                res.send(response);
                                            } else {
                                                                                          
                                                var sql = `INSERT INTO user (full_name,first_name,last_name,company_user_role,company_id,email,password,role_id,created_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.cfull_name,null , null, post.crole,post.company_id, post.cemail,hash,3, created_date]
                                                    ]
                                                ];
                                                connection.query(sql, values, function (err, response) {
                                                    if (err) {
                                                        console.log(err)
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in update query');
                                                        res.send(response);
                                                    } else {
                                                        response = general.response_format(true, "User created successfully", {}, connection, post, "front/student/updateprofile", 'profile update success');
                                                        res.send(response);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                                

                            }
                        }
                    })
                }else{
                    //check company name exist or not
                    var checkemail = "SELECT * FROM company WHERE (company_email = '" + post.scompany_email + "') AND status!='2'"; 
                    connection.query(checkemail, function (err, checkemail) {
                        if (err) {
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            if (checkemail.length > 0) {
                                response = general.response_format(false, 'Company email already exist', {}, connection, post, "admin/user/adduser", msg);
                                res.send(response);
                            }else{
                                //check with company title
                                var checktitle = "SELECT * FROM company WHERE (company_name = '" + post.scompany_name + "') AND status!='2'"; 
                                connection.query(checktitle, function (err, checktitle) {
                                    if (err) {
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                                        res.send(response);
                                    } else {
                                        if (checktitle.length > 0) {
                                            response = general.response_format(false, 'Company name already exist', {}, connection, post, "admin/user/adduser", msg);
                                            res.send(response);
                                        }else{
                                            //create a company
                                            var sql = `INSERT INTO company (company_name,company_email,company_website,created_date) VALUES ?`;
                                            var values = [
                                                [
                                                    [post.scompany_name, post.scompany_email,post.scompany_website, created_date]
                                                ]
                                            ];
                                            connection.query(sql, values, function (err, response) {
                                                if (err) {
                                                    console.log(err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in update query');
                                                    res.send(response);
                                                } else {
                                                   //create a user
                                                   var companyinserted = response.insertId;
                                                   bcrypt.genSalt(10, function (err, salt) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                                            res.send(response);
                                                        } else {
                                                            bcrypt.hash(password, salt, function (err, hash) {
                                                                if (err) {
                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                                                    res.send(response);
                                                                } else {
                                                                                                            
                                                                    var sql = `INSERT INTO user (full_name,first_name,last_name,company_user_role,company_id,email,password,role_id,created_date) VALUES ?`;
                                                                    var values = [
                                                                        [
                                                                            [post.cfull_name, null, null, post.crole,companyinserted, post.cemail,hash,3, created_date]
                                                                        ]
                                                                    ];
                                                                    connection.query(sql, values, function (err, response) {
                                                                        if (err) {
                                                                            console.log(err)
                                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in update query');
                                                                            res.send(response);
                                                                        } else {
                                                                            response = general.response_format(true, "User created successfully", {}, connection, post, "front/student/updateprofile", 'profile update success');
                                                                            res.send(response);
                                                                        }
                                                                    })
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
                        }
                    })
                }
                
                
            }
        })

    }else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response); 
    }
}

return false;
    var required_params = ['admin_id', 'first_name','last_name','phone','email','password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        
        var phone_data = functions.validateNumber(post.phone);
        var phone_international = phone_data.international_phone;
        var phone_national = phone_data.national_phone;
        var phone_e164 = phone_data.E164_phone;
        var phone = phone_data.number;
        var country_code = phone_data.country_code;
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/adduser", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkphone = "SELECT * FROM user WHERE (email = BINARY '" + post.email + "' OR phone = '" + phone + "' OR phone_international = '" + phone_international + "' OR phone_national = '" + phone_national + "' OR phone_e164 = '" + phone_e164 + "') AND status!='2' "; 
                connection.query(checkphone, function (err, checkemail) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (checkemail.length > 0) {
                            var msg = "";
                            
                            if ((checkemail[0].phone === post.phone || checkemail[0].phone_international === post.phone || checkemail[0].phone_national === post.phone || checkemail[0].phone_e164 === post.phone) && (checkemail[0].email === post.email)) {
                                console.log("testest")
                                var msg = "Email and Phone number already exist";
                            } else if (checkemail[0].email === post.email) {
                                console.log("testest22")
                                var msg = "Email already exist";
                            }
                            else if (checkemail[0].phone === post.phone || checkemail[0].phone_international === post.phone || checkemail[0].phone_national === post.phone || checkemail[0].phone_e164 === post.phone) {
                                console.log("testest333")
                                var msg = "Phone number already exist";
                            }
                            response = general.response_format(false, msg, {}, connection, post, "admin/user/adduser", msg);
                            res.send(response);
                        } else {

                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in genSalt');
                                    res.send(response);
                                } else {
                                    bcrypt.hash(post.password, salt, function (err, hash) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'error in hash');
                                            res.send(response);
                                        } else {
                                            var sql = `INSERT INTO user (full_name,first_name,last_name,email,phone,password,is_verified,role_id,phone_international,phone_national,phone_e164,created_by,created_date) VALUES ?`;
                                            var values = [
                                                [
                                                    [post.first_name+' '+post.last_name,post.first_name, post.last_name,post.email,post.phone,hash,1,2,phone_international, phone_national, phone_e164,post.admin_id,created_date]
                                                ]
                                            ];
                                            connection.query(sql,values, function (err, rowsdata) {
                                                if (err) {
                                                    console.log(err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in create user query');
                                                    res.send(response);
                                                }  else {
                                                    response = general.response_format(true, messages.USER_CREATED, {}, connection, post, "admin/user/adduser", "user created successfully");
                                                    res.send(response);
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
    } else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);   
    }
});



//api for update admin timeslot 
router.post('/user/updateadmintimeslot',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;

    var required_params = ['admin_id', 'timeslot1','timeslot2','timeslot3'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
       
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/updateuser", 'Datebase Connection error');
                res.send(response);
            } else{
                var sql = "UPDATE admin_timeslot SET time_slot1 = ?,time_slot2 = ?, time_slot3 = ?, updated_date =? WHERE id = ? ";
                var values = [post.timeslot1, post.timeslot2, post.timeslot3, created_date, 1]
                connection.query(sql,values, function (err, rowsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updateuser", 'Mysql error in update user query');
                        res.send(response);
                    }  else {
                        response = general.response_format(true, 'Timeslot Updated Successfully', {}, connection, post, "admin/user/updateuser", "profile updated successfully");
                        res.send(response);
                    }
                })
            }
        });
    } else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);   
    }
});
router.post('/user/studentdetails', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenAdmin, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['admin_id','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var sql = `SELECT u.*,cp.career_name as career_name FROM user u 
                LEFT JOIN career_path cp ON cp.id=u.career_path_id
                WHERE u.id=${post.student_id}`;
                connection.query(sql,(err,users)=>{
                    if(err){
                        console.log(err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                        res.send(response);
                    }else{
                        if(users.length > 0){
                            let temp_obj = users[0];
                            var candidatename=temp_obj['first_name']+' '+temp_obj['last_name']
                            let user = {
                                user_id: temp_obj['id'],
                                full_name: candidatename,
                                phone : (temp_obj['phone'])?temp_obj['phone']:'',
                                email : (temp_obj['email'])?temp_obj['email']:'',
                                career_path: (temp_obj['career_name'])?temp_obj['career_name']:'',
                                racial_identity: (temp_obj['racial_identity'])?constants.RACIAL_IDENTITY[temp_obj['racial_identity']]:'',
                                current_progress_status: (temp_obj['current_progress_status'])?temp_obj['current_progress_status']:0,
                                looking_for_job: (temp_obj['looking_for_job'])?temp_obj['looking_for_job']:0,
                                has_offer:'',
                                technical_assisment:'',
                                student_details: [],
                                student_work_history: [],
                                student_education: [],
                                student_attachment: [],
                            }
                            async.waterfall([
                                function(callback) {
                                    //detail data
                                    // (SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') from skills WHERE id IN(sd.skills)) as skillname 
                                    var checkdetails = `SELECT sd.*,ct.name as place                                   
                                    FROM student_details sd
                                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                                    WHERE sd.user_id =${temp_obj['id']} ;`
                                    console.log(checkdetails)
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            var detailobj = {}
                                            console.log("checkdetailsdata[0].experience_level",checkdetailsdata)
                                            if(checkdetailsdata.length> 0){
                                                detailobj.experience_level = (checkdetailsdata[0].experience_level)?constants.EXPERIENCE[checkdetailsdata[0].experience_level]:''
                                                detailobj.currently_lived = checkdetailsdata[0].place
                                                detailobj.employment_type = constants.EMPLOYMENT[checkdetailsdata[0].employment_type]
                                                detailobj.interested_remortely = (checkdetailsdata[0].interested_remortely == 0)?'No':'Yes'
                                                detailobj.willing_to_works = checkdetailsdata[0].willing_to_works
                                                detailobj.looking_for_role = checkdetailsdata[0].looking_for_role
                                            
                                                detailobj.bio = checkdetailsdata[0].bio
                                                detailobj.anything_else_details = checkdetailsdata[0].anything_else_details
                                                detailobj.resume = (checkdetailsdata[0].resume) ? checkdetailsdata[0].resume : ''
                                                detailobj.resume_url = (checkdetailsdata[0].resume) ? constants.API_URL+'resume/'+checkdetailsdata[0].resume : ''
                                                detailobj.github_url = checkdetailsdata[0].github_url ? checkdetailsdata[0].github_url : ''
                                                detailobj.linkedin_url = checkdetailsdata[0].linkedin_url ? checkdetailsdata[0].linkedin_url : ''
                                                detailobj.website_url = checkdetailsdata[0].website_url ? checkdetailsdata[0].website_url : ''
                                                if(checkdetailsdata[0].skills){
                                                    var sql = `SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') as skill_name FROM skills WHERE id IN(${checkdetailsdata[0].skills});`
                                                    connection.query(sql, function (err, skilldata) {
                                                        if (err) {
                                                            dataCB(err)
                                                        } else {
                                                            // var array11 = skilldata[0].skill_name.split(',',3);
                                                            // var result = array11.join(', ')
                                                            detailobj.skills = skilldata[0].skill_name;
                                                            user.student_details = detailobj
                                                            callback(null);
                                                        }
                                                    })
                                                }else{
                                                    detailobj.skills = '';
                                                    user.student_details = detailobj
                                                    callback(null);
                                                }
                                            }else{
                                                detailobj.experience_level = ''
                                                detailobj.currently_lived = ''
                                                detailobj.employment_type = ''
                                                detailobj.interested_remortely = ''
                                                detailobj.willing_to_works = ''
                                                detailobj.looking_for_role = ''
                                            
                                                detailobj.bio = ''
                                                detailobj.anything_else_details = ''
                                                detailobj.resume = ''
                                                detailobj.resume_url = ''
                                                detailobj.github_url = ''
                                                detailobj.linkedin_url = ''
                                                detailobj.website_url = ''
                                                detailobj.skills = ''
                                                user.student_details = detailobj
                                                callback(null);
                                            }
                                            
                                            
                                            
                                            
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var gettechnicalskill = `SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') as technicalskills from skills WHERE id IN(SELECT skill_id from student_skill where user_id=${temp_obj['id']} AND skill_exam_status=3) ;`
                                    console.log("gettechnicalskill",gettechnicalskill)
                                    connection.query(gettechnicalskill, function (err, gettechnicalskilldata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.technical_assisment = gettechnicalskilldata[0].technicalskills
                                            callback(null);   
                                        }
                                    })

                                },           
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT *,DATE_FORMAT(start_date, '%m/%d/%Y') as start_date,DATE_FORMAT(end_date, '%m/%d/%Y') as end_date FROM student_work_history WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_work_history = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT *,DATE_FORMAT(start_date, '%m/%d/%Y') as start_date,DATE_FORMAT(end_date, '%m/%d/%Y') as end_date FROM student_education WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_education = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = `SELECT * FROM student_attachment WHERE user_id=${temp_obj['id']} ORDER BY id ASC `;
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            checkdetailsdata = checkdetailsdata.map((item) => {
                                                return {
                                                    id: item.id,
                                                    user_id: item.user_id,
                                                    certification: item['certification'] ? item['certification'] : '',
                                                    certification_url: (item['certification'])?constants.API_URL+'certification/'+item['certification']: ''
                                                };
                                            });
                                            user.student_attachment = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT * FROM watchlist_student WHERE student_id = '" + post.student_id + "' AND status=9 ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.has_offer = (checkdetailsdata.length>0)?'Yes':'No' 
                                            callback(null);
                                        }
                                    })
                                },
                            ],(err,result)=>{
                                console.log("responsedata",user)
                                response = general.response_format(true, messages.SUCCESS, user, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                res.send(response);
                            })
                                            
                            
                        }else{
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'error student not found');
                            res.send(response);
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

router.post('/user/geteditstudentdetails', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenAdmin, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['admin_id','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var sql = `SELECT u.*,cp.career_name as career_name FROM user u 
                LEFT JOIN career_path cp ON cp.id=u.career_path_id
                WHERE u.id=${post.student_id}`;
                connection.query(sql,(err,users)=>{
                    if(err){
                        console.log(err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                        res.send(response);
                    }else{
                        if(users.length > 0){
                            let temp_obj = users[0];
                            var candidatename=temp_obj['first_name']+' '+temp_obj['last_name']
                            let user = {
                                user_id: temp_obj['id'],
                                full_name: candidatename,
                                phone : (temp_obj['phone'])?temp_obj['phone']:'',
                                email : (temp_obj['email'])?temp_obj['email']:'',
                                career_path: (temp_obj['career_name'])?temp_obj['career_name']:'',
                                current_progress_status: (temp_obj['current_progress_status'])?temp_obj['current_progress_status']:0,
                                looking_for_job: (temp_obj['looking_for_job'])?temp_obj['looking_for_job']:0,
                                has_offer:'',
                                technical_assisment:'',
                                student_details: [],
                                student_work_history: [],
                                student_education: [],
                                student_attachment: [],
                            }
                            async.waterfall([
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT * FROM student_details WHERE user_id = '" + temp_obj['id'] + "' ";
                                    console.log(checkdetails)
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_details = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT *,DATE_FORMAT(start_date, '%m/%d/%Y') as start_date,DATE_FORMAT(end_date, '%m/%d/%Y') as end_date FROM student_work_history WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_work_history = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT *,DATE_FORMAT(start_date, '%m/%d/%Y') as start_date,DATE_FORMAT(end_date, '%m/%d/%Y') as end_date FROM student_education WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_education = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = `SELECT * FROM student_attachment WHERE user_id=${temp_obj['id']} ORDER BY id ASC `;
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            checkdetailsdata = checkdetailsdata.map((item) => {
                                                return {
                                                    id: item.id,
                                                    user_id: item.user_id,
                                                    certification: item['certification'] ? item['certification'] : '',
                                                    certification_url: (item['certification'])?constants.API_URL+'certification/'+item['certification']: ''
                                                };
                                            });
                                            user.student_attachment = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT * FROM watchlist_student WHERE student_id = '" + post.student_id + "' AND status=9 ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.has_offer = (checkdetailsdata.length>0)?'Yes':'No' 
                                            callback(null);
                                        }
                                    })
                                },
                            ],(err,result)=>{
                                console.log("responsedata",user)
                                response = general.response_format(true, messages.SUCCESS, user, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                res.send(response);
                            })
                                            
                            
                        }else{
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'error student not found');
                            res.send(response);
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

module.exports = router;

