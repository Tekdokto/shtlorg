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


/*
API for get video list for user
Request Param: user_id
*/
//functions.verifyTokenFront,
router.post('/videouser/getvideolist', multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    console.log("innerpage in new user")
    var post = req.body;
    var required_params = ['user_id','page'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {

        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = post.page;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
        let search_query = "";
        var sort = "ORDER BY v.video_order ASC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            var sort = " ORDER BY "+sort_by+sort_sequence;
        }
        if(post.filtred && Object.keys(post.filtred).length > 0){
            if(post.filtred.video_title && post.filtred.video_title != ""){
             
                search_query += ` AND (v.video_title like '%${post.filtred.video_title}%')`;
            }
        }
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "videouser/getvideolist", 'Datebase Connection error');
                res.send(response);
            } else {
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND v.id = ${post.id}`;
                }
                var count_sql = `SELECT COUNT(*) AS total FROM videos v WHERE v.status != ? ${search_query} ${sort}`;
                connection.query(count_sql, [2], function (err, rows) {
                   console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/getvideolist", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT v.id,v.video_title,v.video_url,v.video_order,v.status,
                        DATE_FORMAT(v.created_date, "%Y-%m-%d") as created_date,
                        (SELECT COUNT(sv.video_id) FROM student_video sv where sv.video_id = v.id AND sv.user_id = ${post.user_id}) as watchedcount
                        FROM videos v
                        
                        WHERE v.status != ?  ${search_query} ${sort} LIMIT ${limit}`;
                        console.log(sql)
                        connection.query(sql, [2], function (err, result) {
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/getvideolist", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "videouser/getvideolist", "video Data Fetched Successfully");
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

//API for change user video status as a watched
router.post('/videouser/changevideostatus',  multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log(post)
    
   
    var required_params = ['user_id', 'id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (valid) {
        var id = post.id;
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "videouser/changevideostatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkid = "SELECT * FROM videos WHERE  status!='2' AND id = '" + id + "' "; 
                connection.query(checkid, function (err, idponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/changevideostatus", 'Mysql error in check video query');
                        res.send(response);
                    } else {
                        if (idponse.length > 0) {
                            var sql = `INSERT INTO student_video (user_id,video_id,status,created_date) VALUES ?`;
                            var values = [
                                [
                                    [post.user_id,post.id,1,created_date]
                                ]
                            ];
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/changevideostatus", 'Mysql error in update video status query');
                                    res.send(response);
                                }  else {
                                    //check all video watched or not
                                    var checkvideo = `SELECT COUNT(*) as totalvideo FROM videos WHERE  status =1;SELECT * FROM student_video WHERE status =1 AND user_id=${post.user_id} GROUP BY video_id;`; 
  
                                    connection.query(checkvideo, function (err, checkvideo) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/changevideostatus", 'Mysql error in check total video watched query');
                                            res.send(response);
                                        } else {
                                            var totalvideo = checkvideo[0][0].totalvideo
                                            var watchedcount = checkvideo[1].length
                                            if(totalvideo == watchedcount){
                                                console.log("sameallvideo",totalvideo,watchedcount)
                                                //update progress status in user table
                                                var sql = "UPDATE user SET current_progress_status = ? WHERE id = " + post.user_id;
                                                var values = [2]
                                                connection.query(sql, values, function (err, response) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/changevideostatus", 'Mysql error in update user current progress status update query');
                                                        res.send(response);
                                                    } else {
                                                        response = general.response_format(true, 'Success', {}, connection, post, "videouser/changevideostatus", "video status successfully");
                                                        res.send(response);
                                                    }
                                                })
                                               
                                            }else{
                                                console.log("sameallvideonathi",totalvideo,watchedcount)
                                                response = general.response_format(true, 'Success', {}, connection, post, "videouser/changevideostatus", "video status successfully");
                                                res.send(response);
                                            }
                                            
                                        }
                                    })
                                   
                                }
                            })

                        }else{
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/changevideostatus", 'Mysql error in check video length query');
                            res.send(response);
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


/*
API for set mock interview for user
Request Param: user_id,on_date,on_time
*/
router.post('/videouser/set_mock_interview',  multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['user_id','on_date','on_time'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (valid) {
    
        var customdate = post.on_date+' '+post.on_time
        // var d = new Date(newdate);
        // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY h:mm A");
    console.log("customdate",customdate)	
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "student/videouser/set_mock_interview", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkid = "SELECT * FROM student_mock_interview WHERE  status IN(0,2) AND user_id = '" + post.user_id + "' "; 
                connection.query(checkid, function (err, idponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "student/videouser/set_mock_interview", 'Mysql error in check mock interview query');
                        res.send(response);
                    } else {
                        if (idponse.length > 0) {
                            if(idponse[0].status == 2){
                                response = general.response_format(false, "You have already passed the Mock Interview", {}, connection, post, "student/videouser/set_mock_interview", 'error- You have already passed the Mock Interview');
                                res.send(response);
                            }else{
                                response = general.response_format(false, 'You have already set the Mock Interview', {}, connection, post, "student/videouser/set_mock_interview", 'error-You have already set the Mock Interview');
                                res.send(response);
                            }
                            
                        }else{
                            var sql = `INSERT INTO student_mock_interview (user_id,on_date,on_time,status,created_date) VALUES ?`;
                            var values = [
                                [
                                    [post.user_id,post.on_date,post.on_time,0,created_date]
                                ]
                            ];
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/videouser/set_mock_interview", 'Mysql error in set moock interview query');
                                    res.send(response);
                                }  else {

                                    //email sent to admin for mock interview round
                                    // var interviewdate = moment(post.on_date,'YYYY-MM-DD').format('Do MMMM YYYY');
                                    // var newdate = interviewdate+" "+post.on_time;
                                    var newdateonly = moment(post.on_date).format('MM-DD-YYYY')
                                    var customdate = newdateonly+' '+post.on_time
                                  
                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 4;
                                    SELECT * FROM user WHERE id = ${post.user_id}`;
                                    connection.query(sql, function (err, email_template) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/videouser/set_mock_interview", 'email_template err');
                                            res.send(response);
                                        } else {
                                            var customurl = constants.ADMIN_URL+"admin/mock-interview/list"
                                            var userfulllname = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                            var html = email_template[0][0].emailtemplate_body;
                                            var html = html.replace(/{candidate_name}/gi, (userfulllname) ? userfulllname : '');
                                            var html = html.replace(/{date_time}/gi, (customdate) ? customdate : '');
                                            var html = html.replace(/{email}/gi, (email_template[1][0].email) ? email_template[1][0].email : '');
                                            var html = html.replace(/{customurl}/gi, (customurl) ? customurl : '');
                                            var data = { to: constants.ADMIN_EMAIL, subject: email_template[0][0].emailtemplate_subject, html: html };
                                           // console.log("mail call", html)
                                            emailservice.sendMailnew(req, data, function (result) {
                                                console.log("result", result)
                                            });
                                            response = general.response_format(true, 'Mock Interview set successfully on your defined date and time.', {}, connection, post, "student/videouser/set_mock_interview", "mock interview schedule successfully");
                                            res.send(response);
                    
                                        }
                                    });
                                   
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

/*
API for get mock interview last record based on user
Request Param: user_id
*/

router.post('/videouser/get_mock_interview_record', multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    console.log("innerpage in new user")
    var post = req.body;
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
         req.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "videouser/get_mock_interview_record", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = `SELECT *, DATE_FORMAT(v.on_date, "%m/%d/%Y") as on_date
                        FROM student_mock_interview v
                        WHERE v.user_id = ${post.user_id} ORDER BY id DESC LIMIT 1`;
                        console.log(sql)
                        connection.query(sql, function (err, result) {
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "videouser/get_mock_interview_record", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "videouser/get_mock_interview_record", "mock interview Data Fetched Successfully");
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


module.exports = router;

