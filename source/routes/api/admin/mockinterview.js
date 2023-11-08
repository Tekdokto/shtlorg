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



//functions.verifyTokenAdmin,
router.post('/mockinterview/getmock', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage in new user")
    var post = req.body;
    var required_params = ['admin_id','page_size'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        let statusquery = "";
        if(post.status && post.status == 'pending')
        {
            statusquery  += ` mi.status = 0` 
           
        }else{
            statusquery  += ` mi.status != 0` 
        }
        var page = post.page;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
        let search_query = "";
        var sort = "ORDER BY mi.id desc";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'name'){
                var sort = " ORDER BY u.first_name "+sort_sequence;
            }else if(sort_by == 'on_date'){
                var sort = " ORDER BY mi.on_date"+sort_sequence;
            }else if(sort_by == 'on_time'){
                var sort = " ORDER BY mi.on_time"+sort_sequence;
            }else{
                var sort = " ORDER BY "+sort_by+sort_sequence;
            }
        }
        if(post.filtred && Object.keys(post.filtred).length > 0){
            if(post.filtred.name && post.filtred.name != ""){
             
                search_query += ` AND (u.first_name like '%${post.filtred.name}%' OR u.last_name like '%${post.filtred.name}%')`;
            }
            if(post.filtred.on_date && post.filtred.on_date != ""){
                var newdateonly = moment(post.filtred.on_date).format('YYYY-MM-DD')
                console.log("newdateonly",newdateonly)
                if(newdateonly){
                    search_query += ` AND (DATE_FORMAT(mi.on_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                }
                
            }
            if(post.filtred.on_time && post.filtred.on_time != ""){
                search_query += ` AND (mi.on_time LIKE '%${post.filtred.on_time}%')`;
            }
            
           
        }
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/mockinterview/getmock", 'Datebase Connection error');
                res.send(response);
            } else {
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND mi.id = ${post.id}`;
                }
                var count_sql = `
                SELECT COUNT(*) AS total,CONCAT(u.first_name, ' ', u.last_name) as name,u.id as user_id
                        FROM student_mock_interview mi
                        LEFT JOIN user u ON u.id=mi.user_id
                        WHERE ${statusquery}  ${search_query} ${sort}`;
                connection.query(count_sql, function (err, rows) {
                   console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/mockinterview/getmock", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT mi.id,mi.on_time,mi.status,u.id as user_id,
                        DATE_FORMAT(mi.on_date, "%m/%d/%Y") as on_date,
                        CONCAT(u.first_name, ' ', u.last_name) as name 
                        FROM student_mock_interview mi
                        LEFT JOIN user u ON u.id=mi.user_id
                        WHERE ${statusquery}  ${search_query} ${sort} LIMIT ${limit}`;
                        
                        connection.query(sql, function (err, result) {
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/mockinterview/getmock", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/mockinterview/getmock", "Mock interrview Data Fetched Successfully");
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
//API for change mock interview status
router.post('/mockinterview/changestatus', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var remark = (post.remark)?post.remark:''
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/mockinterview/changestatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE student_mock_interview SET status = ?,remark=? WHERE id = ?";
                connection.query(sql, [post.status,remark, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/mockinterview/changestatus", 'Error in update query');
                        res.send(response);
                    } else {

                            var message = (post.status == 1) ? 'Candidate set as a Fail' :  'Candidate set as a Pass';
                            var templateid = (post.status == 1) ? 5 :  17;
                      
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
                                    var newdateonly = moment(email_template[2][0].on_date).format('MM-DD-YYYY')
                                   
                                    var customdate = newdateonly+' '+email_template[2][0].on_time
                                    // var d = new Date(newdate);
                                    // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY h:mm A");
                                    console.log("customdate",customdate)
                                    var userfulllname = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                    var html = email_template[0][0].emailtemplate_body;
                                    var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                    var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                    var html = html.replace(/{result}/gi, (post.status == 1) ? 'Fail' : 'Pass');                    
                                    var html = html.replace(/{date_time}/gi, (customdate) ? customdate : '');                    
                                    if(post.status == 1){
                                        var html = html.replace(/{remark}/gi, (post.remark) ? post.remark : '');
                                    }
                                    var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                    console.log("mail call", html)
                                    emailservice.sendMailnew(req, data, function (result) {
                                        console.log("result", result)
                                    });
                                    if(post.status != 1){
                                        //update current progress of student to 3
                                        var sql = "UPDATE user SET current_progress_status = ? WHERE id = ?";
                                        connection.query(sql, [3, email_template[2][0].user_id], function (err, updateres) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/mockinterview/changestatus", 'Error in update query user');
                                                res.send(response);
                                            } else {
                                                response = general.response_format(true, message, {}, connection, post, "admin/mockinterview/changestatus", "mock interview status changed successfully");
                                                res.send(response);
                                            }
                                        })
                        
                                       
                                    }else{
                                        response = general.response_format(true, message, {}, connection, post, "admin/mockinterview/changestatus", "mock interview status changed successfully");
                                        res.send(response);
                                    }
                                  
            
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
// API for update mock interview time/date
router.post('/mockinterview/updatemockinterview', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'on_date', 'on_time'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var remark = (post.remark)?post.remark:''
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/mockinterview/updatemockinterview", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE student_mock_interview SET on_date = ?,on_time=? WHERE id = ?";
                connection.query(sql, [post.on_date, post.on_time, post.id], function (err) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/mockinterview/updatemockinterview", 'Error in update query');
                        res.send(response);
                    } else {
                        response = general.response_format(true, 'Mock Interview update successfully on your defined date and time.', {}, connection, post, "admin/mockinterview/updatemockinterview", "mock interview date and time changed successfully");
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
})


module.exports = router;

