var express = require('express');
var router = express.Router();
var hash = require('../../pass').hash;
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var msg = require('../../config/messages');
var func = require('../../config/functions');
var functions = func.func();
var messages = msg.messages;
var async = require('async');
var thumb = require('node-thumbnail').thumb;
var auth_service = require('../../services/auth');
var generalfunction = require('../../services/general');
var general = generalfunction.func();
var eml = require('../../services/email');
var emailservice = eml.func();
const constants = require('../../config/constants');
var locale = require('../../config/configi18n');
var jwt = require('jsonwebtoken');
const io = require('socket.io')();
var moment = require('moment');

var lodash = require('lodash');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
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
        cb(null, microsecond + path.extname(file.originalname)); // Date.now() + '.' + getFileExt(file.originalname))
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
                let sql = "SELECT * from user where email = ? AND status != ?, role_id = ? ";
                let query_data = [post.email,2,1];
                connection.query(sql, query_data, function (err, result) {
                    if (err) {
                        response = general.response_format(false, messages.PROBLEM_IN_LISTING_SQL_QUERY_ERROR, {},connection,post,"user/login",'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        if (result[0].status == 0) {

                            response = general.response_format(false, 'Your account is deactivated. Please Contact the admin', {},connection,post,"user/login",'Account is deactivated');
                            res.send(response);
                        } else if (result[0].status == 2) {
                            response = general.response_format(false, 'Your account is deleted. Please Contact the admin', {},connection,post,"user/login",'account is deleted');
                            res.send(response);
                        } else {
                            bcrypt.compare(post.password, result[0].password, (err, db_res) => {
                                if (db_res) {
                                    let jwtData;

                                    var user = { user_id: result[0].id };
                                    general.get_user_structure_data(req, user, function (result) {
                                        if (result.status == 1) {
                                            console.log("#user pic", user,result);
                                            jwtData = result.data;
                                            const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                expiresIn: 86400 // 1 day
                                            });
                                            var data = {
                                                user_id: result.data.user_id
                                            };

                                            
                                            response = general.response_format(true, 'User Login Successfully', result.data,connection,post,"user/login",'User Login Successfully');
                                            response.token = token;
                                            res.send(response);
                                            
                                        }
                                        else {
                                            //  res.send(result);
                                            response = general.response_format(false, result.message, {},connection,post,"user/login",'result.status !=1');
                                            res.send(response);
                                        }
                                    });
                                } else {

                                    response = general.response_format(false, messages.PASSWORD_DOES_NOT_MATCH, {});
                                    res.send(response);
                                }
                            })
                        }

                    } else {
                        //if email not exist
                        response = general.response_format(false, "Email address is not registered", {},connection,post,"user/login",'email address not registered');
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
                        response = general.response_format(false, err, {},connection,post,"user/forgotpassword",'User check email and status');
                        res.send(response);
                    }
                    else {
                        if (rows.length > 0) {
                            if (rows[0].status == 0) {
                                response = general.response_format(false, messages.INACTIVE_ACCOUNT, {},connection,post,"user/forgotpassword",'Account is deactivated');
                                res.send(response);
                            }
                            else {
                                var passwordResetToken = bcrypt.genSaltSync(25).replace(/\//gi, 'A');
                                var sql = "UPDATE `user` SET password_reset_token=?,password_reset_time=? WHERE id = ?";
                                var values = [passwordResetToken,moment().format('YYYY-MM-DD HH:mm:ss'), rows[0].id];
                                connection.query(sql, values, function (err, updateResetToken) {
                                    if (err) {
                                        response = general.response_format(false, messages.ERROR_PROCESSING, {},connection,post,"user/forgotpassword",'Error in update forgot password token');
                                        res.send(response);
                                    }
                                    else {
                                        //email-start
                                        var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 1; ";
                                        connection.query(sql, function (err, email_template) {
                                            if (err) {
                                                
                                                response = general.response_format(false, messages.ERROR_PROCESSING, {},connection,post,"user/forgotpassword",'email_template err');
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
                                                response = general.response_format(true, 'Mail sent successfully', {},connection,post,"user/forgotpassword",'Mail sent successfully');
                                                    res.send(response);
                                               
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            response = general.response_format(false, messages.USER_NOT_FOUND, {},connection,post,"user/forgotpassword",'user not found');
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
                       
                        response = general.response_format(false, messages.OOPS, {},connection,post,"user/verifypasswordtoken",'error in select query');
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
                                    response = general.response_format(false, 'Link has been Expires.Please Try again!',{},connection,post,"user/verifypasswordtoken",'Link has been Expires');
                                    res.send(response);
                                } else {
                                    response = general.response_format(true, messages.SUCCESS, rows[0],connection,post,"user/verifypasswordtoken",'Success');
                                    res.send(response);
                                }
                            } else {
                                response = general.response_format(true, messages.SUCCESS, rows[0],connection,post,"user/verifypasswordtoken",'Success');
                                res.send(response);
                            }
                        } else {
                            response = general.response_format(false, "Link is not valid", {},connection,post,"user/verifypasswordtoken",'Link is not valid');
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
                        response = general.response_format(false, messages.OOPS, {},connection,post,"user/resetpassword",'error in select query');
                        res.json(response);
                    } else {
                        if (rows.length > 0) {
                                bcrypt.genSalt(10, function (err, salt) {
                                    if (err) {
                                        response = general.response_format(false, err, {},connection,post,"user/resetpassword",'bcrypt.genSalt');
                                        res.send(response);
                                    }
                                    else {
                                        bcrypt.hash(post.confirmpassword, salt, function (err, hash) {
                                            if (err) {
                                               
                                                response = general.response_format(false, err, {},connection,post,"user/resetpassword",'bcrypt.hash');
                                                res.send(response);
                                            }
                                            else {
                                                var sql = "UPDATE `user` SET password=?,password_reset_token=?,password_reset_time = ?  WHERE id = ?";
                                                var values = [hash, "", moment().format('YYYY-MM-DD HH:mm:ss'), rows[0].id];
                                                connection.query(sql, values, function (err, data) {
                                                    if (err) {
                                                        response = general.response_format(false, err, {},connection,post,"user/resetpassword",'error in update password query');
                                                        res.send(response);
                                                    }
                                                    else {
                                                        response = general.response_format(true, messages.PASSWORD_UPDATED, {},connection,post,"user/resetpassword",'Password updated successfully');
                                                        res.send(response);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                           
                        } else {
                            response = general.response_format(false, "Link is not valid", {},connection,post,"user/resetpassword",'Link is not valid');
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

router.post('/user/changepassword', upload.array(), function (req, res, next) {
    var post = req.body;
    response = {};
    console.log('change password:',post);
    
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
                connection.query("SELECT * FROM user WHERE id='" + post.user_id + "' AND status = 1 AND role_id = '1'", function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {},connection,post,"user/changepassword",'error in select query');
                        res.json(response);
                        // res.json({ "status": 0, "message": messages.OOPS });
                    } else {
                        if (rows.length > 0) {
                            var password_hash = rows[0].password;
                            var user_id = rows[0].user_id;
                            // Load hash from your password DB.
                            bcrypt.compare(currentpassword, password_hash, function (err, result) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {},connection,post,"user/changepassword",'error in bcrypt compare');
                                    res.json(response);
                                } else {
                                    if (result == true) {
                                        bcrypt.genSalt(10, function (err, salt) {
                                            if (err) {                                               
                                                
                                                response = general.response_format(false, messages.OOPS, {},connection,post,"user/changepassword",'error in bcrypt salt');
                                                res.json(response);
                                            } else {
                                                bcrypt.hash(newpassword, salt, function (err, hash) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {},connection,post,"user/changepassword",'error in bcrypt hash');
                                                        res.json(response);
                                                    } else {
                                                        connection.query("UPDATE user SET password = '" + hash + "', password_reset_token='' WHERE id = '" + post.user_id + "'", function (err, data) {
                                                            if (err) {
                                                                console.log("eror",err)
                                                                response = general.response_format(false, messages.OOPS, {},connection,post,"user/changepassword",'error in update query');
                                                                res.json(response);
                                                            } else {
                                                                console.log("UPDAFE",err,data)
                                                                if (data.affectedRows > 0) {
                                                                    console.log("IN IF")
                                                                    response = general.response_format(true, messages.PASSWORD_UPDATED, {},connection,post,"user/changepassword",'Password changed successfully');
                                                                    res.json(response);
                                                                } else {
                                                                    console.log("IN ELSE");
                                                                    response = general.response_format(false, messages.OOPS, {},connection,post,"user/changepassword",'update query not affected');
                                                                    res.json(response);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        response = general.response_format(false, messages.WRONG_CURRENT_PASSSWORD, {},connection,post,"user/changepassword",'error in select query');
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

//API for admin dashboard data
router.post('/user/getadmindashboard', upload.array(), function (req, res) {
    var response = {};
    var post = req.body;
    console.log("postdata",post)
    var required_params = ['token'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.json(response);
            } else {
                var sql = "SELECT * FROM user WHERE role_id = ?";
                connection.query(sql, [2], function (err, rows) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {},connection,post,"user/getadmindashboard",'error in select query');
                        res.json(response);
                    } else {
                        var data = {
                            "totaluser":rows.length
                        }
                        
                            response = general.response_format(true, messages.SUCCESS, data,connection,post,"user/getadmindashboard",'success');
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
router.post('/user/get-user', upload.array(), function (req, res) {
    var post = req.body;
    var required_params = ['admin_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "/admin/user/get-user", 'Datebase Connection error');
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
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "/admin/user/get-user", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT * FROM user WHERE status != ? AND role_id = ? ${where_cond} ${order_sql} LIMIT ${offset},${constants.ITEMS_PER_PAGE}`;
                        console.log(sql)
                        connection.query(sql, [2,2], function (err, result) {
                            if (err) {
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "/admin/user/get-user", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "/admin/user/get-user", "User Data Fetched Successfully");
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
router.post('/change-status', upload.array(), function (req, res) {
    var post = req.body;
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "/admin/user/change-status", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE user SET status = ? WHERE id = ?";
                connection.query(sql, [post.status, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.PROBLEM_IN_LISTING_SQL_QUERY_ERROR, {}, connection, post, "/admin/user/change-status", 'Error in update query');
                        res.send(response);
                    } else {
                        var message = (post.status === 1) ? 'User Activated Successfully' : (post.status === 0) ? 'User Deactivated Successfully' : 'User Deleted Successfully'
                        response = general.response_format(true, message, {}, connection, post, "/admin/user/change-status", "User status changed successfully");
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
router.post('/add-update',multerUpload.single('profile_picture'),function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'id', 'first_name','last_name','email','phone','address','city','zipcode','state'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if(valid){
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "/admin/user/add-update", 'Datebase Connection error');
                res.send(response);
            } else{

            }
        });
    } else{
        var str = functions.loadErrorTemplate(elem);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        res.json(response);   
    }
});

module.exports = router;

