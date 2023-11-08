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
        cb(null, microsecond + path.extname(file.originalname)); // Date.now() + '.' + getFileExt(file.originalname))
    }
});
var multerUpload = multer({ storage: storage });

var response = {};
var upload = multer();

router.use(function (req, res, next) {
    console.log("middleware");
    next();
})

router.post('/user/login', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {
    let response = {};
    var post = req.body;
    console.log("#123", post);
    var ipaddress = '';
    var state = '';
    var country = '';
    var todaysdate = moment(new Date()).utc().format('YYYY-MM-DD');
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
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
                let sql = `SELECT * from user where email = '${post.email}' AND status != 2 AND role_id = 3 `;

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
                            
                                bcrypt.compare(post.password, result[0].password, (err, db_res) => {
                                    if (db_res) {                    
                                        let jwtData;
                                        var user = { user_id: result[0].id };
                                        general.get_user_structure_data_company(req, user, function (result) {
                                            if (result.status == 1) {
                                                console.log("#user pic", user, result);
                                                jwtData = result.data;
                                                const token = jwt.sign(jwtData, constants.JWT_SECRET_KEY, {
                                                    expiresIn: 86400 // 1 day
                                                });
                                                var data = {
                                                    user_id: result.data.user_id
                                                };
                                                response = general.response_format(true, 'User Login Successfully', result.data, connection, post, "student/login", 'User Login Successfully');
                                                response.token = token;
                                                res.send(response);
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
router.post('/user/changepassword', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, function (req, res, next) {
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
                connection.query("SELECT * FROM user WHERE id='" + post.user_id + "' AND status = 1 AND role_id = '3'", function (err, rows) {
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
router.post('/user/forgotpassword', multerUpload.fields([{ 'name': 'profile_pic' }]), function (req, res, next) {
    var post = req.body;

    response = {};
    var created_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // var d = new Date();
    // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY");
    var customdate = moment(new Date()).format('MM-DD-YYYY');
//    var time = "04:30 PM"
//     var d1 = new Date(time);
//     var customdate1 = momentzone(time,["h:mm A"]).tz("America/Los_Angeles").format("h:mm A");
//     console.log("ondatetime",customdate1)
//     return false;
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

                var check_sql = `SELECT u.*,c.company_name FROM user u
                LEFT JOIN company c ON c.id=u.company_id WHERE u.status =1  AND u.email = '${username}' AND u.role_id = 3 `;
                

                connection.query(check_sql, function (err, rows) {
                    if (err) {
                        response = general.response_format(false, err, {}, connection, post, "student/forgotpassword", 'User check email and status');
                        res.send(response);
                    }
                    else {
                        if (rows.length > 0) {
                           //email-start for admin for forgot password
                           var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 8; ";
                           connection.query(sql, function (err, email_template) {
                               if (err) {

                                   response = general.response_format(false, messages.OOPS, {}, connection, post, "student/forgotpassword", 'email_template err');
                                   res.send(response);
                               } else {
                                var cutomurl = constants.ADMIN_URL+"admin/company-user-management/list"
                                   var html = email_template[0].emailtemplate_body;
                                   var html = html.replace(/{useremail}/gi, (post.email) ? post.email : '');
                                   var html = html.replace(/{companyname}/gi, (rows[0].company_name) ? rows[0].company_name : '');
                                   var html = html.replace(/{customdate}/gi, (customdate) ? customdate : '');
                                   var html = html.replace(/{customlink}/gi, (cutomurl) ? cutomurl : '');
                                   var data = { to: constants.ADMIN_EMAIL, subject: email_template[0].emailtemplate_subject, html: html };
                                   console.log("mail call", html)
                                   emailservice.sendMailnew(req, data, function (result) {
                                       console.log("result", result)
                                   });
                                   response = general.response_format(true, 'Your request sent successfully to Admin', {}, connection, post, "student/forgotpassword", 'Mail sent successfully');
                                   res.send(response);

                               }
                           });
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

//api for get user data
router.post('/user/getprofile', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

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
                        general.get_user_structure_data_company(req, user, function (result) {
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

//api for get company spec sheet data
//Req: user_id
router.post('/user/getspecsheet', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    let response = {};
    var post = req.body;
    console.log("#", post);
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
                var sql = `SELECT c.*,u.id as user_id FROM user u
                LEFT JOIN company c ON c.id = u.company_id
                WHERE u.id=${post.user_id};`;
                
                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/user/getspecsheet", 'Problem in select query');
                        res.send(response);
                    } else if (result.length > 0) {
                        let temp_obj = result[0];
                        let user = {
                            user_id: temp_obj['user_id'],
                            company_id: temp_obj['id'],
                            logo: (temp_obj['company_logo'])?constants.API_URL+'profile_pic/'+temp_obj['company_logo']:'',
                            primary_company_address: (temp_obj['primary_company_address'])?temp_obj['primary_company_address']:'',
                            what_does_company_do: (temp_obj['what_does_company_do'])?temp_obj['what_does_company_do']:'',
                            size_of_company: (temp_obj['size_of_company'])?temp_obj['size_of_company']:'',
                            company_culture: (temp_obj['company_culture'])?temp_obj['company_culture']:'',
                            why_join: (temp_obj['why_join'])?temp_obj['why_join']:'',
                            offer_any: (temp_obj['offer_any'])?temp_obj['offer_any']:'',
                            offer_any_other_text: (temp_obj['offer_any_other_text'])?temp_obj['offer_any_other_text']:'',
                        }
                        response = general.response_format(true, 'Success', user, connection, post, "front/user/getspecsheet", 'Get user data');
                        res.send(response);

                    } else {
                        //if email not exist
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/user/getspecsheet", 'User not found for user id');
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
//api for update company spec sheet
//Req: 'user_id','company_id', 'what_does_company_do', 'size_of_company', 'company_culture'
router.post('/user/updatespecsheet', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", req.files.profile_pic);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','company_id', 'what_does_company_do', 'size_of_company', 'company_culture'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var primary_company_address = (post.primary_company_address)?post.primary_company_address:''
        var what_does_company_do = (post.what_does_company_do)?post.what_does_company_do:''
        var size_of_company = (post.size_of_company)?post.size_of_company:''
        var company_culture = (post.company_culture)?post.company_culture:''
        var why_join = (post.why_join)?post.why_join:''
        var offer_any = (post.offer_any)?post.offer_any:''
        var offer_any_other_text = (post.offer_any_other_text)?post.offer_any_other_text:''
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let update_profile = "";
                            
                if(req.files.profile_pic && req.files.profile_pic.length > 0 && req.files.profile_pic[0].filename){
                    update_profile+=',company_logo = ?'                     
                }
                
                var sql = `UPDATE company SET primary_company_address = ?,what_does_company_do = ?,size_of_company = ?, company_culture = ?,why_join=?,offer_any=?,offer_any_other_text=?, updated_date = ? ${update_profile} WHERE id = ${post.company_id}`;
                var values = [primary_company_address, what_does_company_do, size_of_company, company_culture, why_join,offer_any,offer_any_other_text, created_date]
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
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/user/updatespecsheet", 'Mysql error in update query');
                        res.send(response);
                    } else {
                        response = general.response_format(true, messages.SPECSHEET_UPDATED, {}, connection, post, "front/user/updatespecsheet", 'spec sheet update success');
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
//api for get dashboard
//Req: 'user_id'
router.post('/user/getdashboard', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

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
                var sql = `SELECT * FROM company_watchlist WHERE user_id = ${post.user_id} AND status = 1 ORDER BY id desc LIMIT 5;
                SELECT COUNT(*) as total_inflight from watchlist_student where user_id=${post.user_id} AND status = 4;
                SELECT COUNT(*) as total_hired from watchlist_student where user_id=${post.user_id} AND status = 10;
                SELECT COUNT(*) as pending_interview from watchlist_student where user_id=${post.user_id} AND status = 2;
                SELECT COUNT(*) as active_watchlist from company_watchlist where user_id=${post.user_id} AND status = 1;
                SELECT c.company_name FROM user u
                LEFT JOIN company c ON c.id = u.company_id
                WHERE u.id=${post.user_id};
                `;
                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("err", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/user/getdashboard", 'Problem in select query');
                        res.send(response);
                    }  else {
                      
                        let user = {
                            company_name: result[5][0].company_name,
                            total_inflight: new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[1][0].total_inflight),
                            total_hired: new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[2][0].total_hired),
                            pending_interview: new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[3][0].pending_interview),
                            active_watchlist: new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(result[4][0].active_watchlist),
                            watchlist: result[0]
                            
                        }
                        response = general.response_format(true, 'Success', user, connection, post, "front/user/getdashboard", 'Get dashboard data');
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
//Email tracking functionality
router.get('/company/trackemail', function (req, res) {
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

//test timezone
router.post('/user/checktimezone', multerUpload.fields([{ 'name': 'profile_pic' }]), (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", req.files.profile_pic);

    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var intortime = moment("2020-07-03",'YYYY-MM-DD').format('YYYY-MM-DD');
    let confirmdate = intortime+' 12:59 AM'
    //var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var currenttime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
    var resettime = moment(confirmdate,'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss');
    var diff = moment.duration(moment(resettime).diff(moment(currenttime))).asMinutes();
    console.log("Result :",currenttime,confirmdate,resettime,diff)
    return false;
    var required_params = ['timeslot1'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/mockinterview/changestatus", 'Datebase Connection error');
                res.send(response);
            } else {
                            var templateid = (post.status == 1) ? 5 :  17;
                            var message = (post.status == 1) ? 'Candidate set as a Fail' :  'Candidate set as a Pass';
                            
                            var sql = `SELECT * FROM email_template WHERE emailtemplate_id = ${templateid};
                            SELECT u.first_name,u.last_name,u.email,u.id FROM student_mock_interview mi
                            LEFT JOIN user u ON u.id=mi.user_id WHERE mi.id = ${post.id};
                            SELECT * FROM student_mock_interview WHERE id = ${post.id}`;
                            console.log(sql)
                            connection.query(sql, function (err, email_template) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/mockinterview/changestatus", 'email_template err');
                                    res.send(response);
                                } else {
                                    //moment.tz.setDefault('UTC');
                                    var newdateonly = moment(email_template[2][0].on_date).format('MM-DD-YYYY')
                                    var customdate = newdateonly+' '+email_template[2][0].on_time
                                    console.log('newdate',customdate);

                                    // var newdate = newdateonly+' '+email_template[2][0].on_time
                                    // var d = new Date(newdate);
                                    // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY h:mm A");
                                    // console.log("customdate",customdate)
                                    // return false;	
                                    // var d = new Date(newdate);
                                    // console.log("customdatedd",d)
                                    // var customdate = momentzone(newdate,['YYYY-MM-DD h:mm A']).tz("America/Los_Angeles").format("MM-DD-YYYY h:mm A");
                                    // console.log("customdate",customdate)
                                    
                                    var userfulllname = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                    var html = email_template[0][0].emailtemplate_body;
                                    var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                    var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                    var html = html.replace(/{result}/gi, (post.status == 1) ? 'Fail' : 'Pass');                    
                                    var html = html.replace(/{date_time}/gi, (customdate) ? customdate : '');                    
                                    if(post.status == 1){
                                        var html = html.replace(/{remark}/gi, (post.remark) ? post.remark : '');
                                    }
                                    var data = { to: 'abcabc@gmail.com', subject: email_template[0][0].emailtemplate_subject, html: html };
                                    //console.log("mail call", html)
                                    emailservice.sendMailnew(req, data, function (result) {
                                        console.log("result", result)
                                    });
                                    if(post.status != 1){
                                        response = general.response_format(true, message, {}, connection, post, "admin/mockinterview/changestatus", "mock interview status changed successfully");
                                                res.send(response);
                        
                                       
                                    }else{
                                        response = general.response_format(true, message, {}, connection, post, "admin/mockinterview/changestatus", "mock interview status changed successfully");
                                        res.send(response);
                                    }
                                  
            
                                }
                            });
            }
        })
          // moment.tz.setDefault('UTC');
        //   var newdate = email_template[2][0].on_date+' '+email_template[2][0].on_time
        // var d = new Date(newdate);
        // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY h:mm A");
        // console.log("customdate",customdate)
        //    var time = post.timeslot1
        //     var d1 = new Date(time);
        //     var customdate1 = momentzone(time,["h:mm A"]).tz("America/Los_Angeles").format("h:mm A");
           
        //     var tz = moment.tz.guess();
        //     var serverdate = moment().format("MM-DD-YYYY h:mm A");
        //     let user = {
        //         timeslotget: time,
        //         converted: customdate1,
        //         servertimezone: tz,
        //         serverdate:serverdate
                
        //     }
        //     response = general.response_format(true, 'Success', user);
        //     res.send(response);
        //     return false;
        
        
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

