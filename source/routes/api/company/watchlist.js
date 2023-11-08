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


/*api for create watchllist
Params: 
*/
router.post('/watchlist/create', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','role_title','career_path_id','primary_contact','how_many_engineers_looking','salary','city'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var description = (post.description)?post.description:''
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var sql = `INSERT INTO company_watchlist (user_id,role_title,career_path_id,primary_contact,how_many_engineers_looking,salary,description,city,created_date) VALUES ?`;
                var values = [
                    [
                        [post.user_id,post.role_title,post.career_path_id,post.primary_contact,post.how_many_engineers_looking,post.salary,description,post.city, created_date]
                    ]
                ];
                connection.query(sql, values, function (err, response) {
                    if (err) {
                        console.log(err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/create", 'Mysql error in insert query');
                        res.send(response);
                    } else {
                        response = general.response_format(true, "My openings created successfully", {watchlistInsertId: response.insertId}, connection, post, "company/watchlist/create", 'my openings created success');
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

/*
API for get watchlist details
PARAM:user_id,watchlist_id
 */
router.post('/watchlist/get_watchlist_detail', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    let response = {};
    var post = req.body;
    var required_params = ['user_id','watchlist_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
       
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "watchlist/get_watchlist_detail", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkdetails = `SELECT * FROM company_watchlist WHERE id = ${post.watchlist_id};`
                console.log('checkdetails',checkdetails)
                connection.query(checkdetails, function (err, checkdetailsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_watchlist_detail", 'Mysql error in get detail query');
                        res.send(response);
                    } else {
                        console.log("checkdetailsdata",checkdetailsdata)
                        if(checkdetailsdata.length > 0){
                            response = general.response_format(true, 'Success', checkdetailsdata,connection,{},"company/watchlist/get_watchlist_detail",'Success');
                            res.send(response);
                        }else{
                            response = general.response_format(true, 'Success', [],connection,{},"company/watchlist/get_watchlist_detail",'Success');
                            res.send(response);
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
})

/*api for update watchlist
Params: user_id,id,role_title,career_path_id,primary_contact,how_many_engineers_looking,salary
*/
router.post('/watchlist/update', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['id','user_id','role_title','career_path_id','primary_contact','how_many_engineers_looking','salary'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var description = (post.description)?post.description:''
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var sql = "UPDATE company_watchlist SET role_title = ?,career_path_id=?,primary_contact=?,how_many_engineers_looking=?,salary=?,city=?,description=?,updated_date=? WHERE id = ?";
                connection.query(sql, [post.role_title,post.career_path_id,post.primary_contact,post.how_many_engineers_looking,post.salary,post.city,description,created_date, post.id], function (err, updateres) {
                    if (err) {
                        console.log(err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/update", 'Mysql error in update query');
                        res.send(response);
                    } else {
                        response = general.response_format(true, "My openings updated successfully", {}, connection, post, "company/watchlist/update", 'my openings updated success');
                        res.send(response);
                    }
                });
               
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

/*api for update watchlist
Params: user_id,id,status
status = 2 = delete, 3= completed
*/
router.post('/watchlist/changestatus', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    let response = {};
    var post = req.body;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['id','user_id','status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
       
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var checkdetails = `SELECT * FROM company_watchlist WHERE id = ${post.id};`
                console.log('checkdetails',checkdetails)
                connection.query(checkdetails, function (err, checkdetailsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_watchlist_detail", 'Mysql error in get detail query');
                        res.send(response);
                    } else {
                        if(checkdetailsdata[0].status == 2){
                            response = general.response_format(false, 'My openings already deleted', {}, connection, post, "company/watchlist/get_watchlist_detail", 'Mysql error in get detail query');
                            res.send(response);
                        }else if(checkdetailsdata[0].status == 3){
                            response = general.response_format(false, 'My openings already completed', {}, connection, post, "company/watchlist/get_watchlist_detail", 'Mysql error in get detail query');
                            res.send(response);
                        }else{
                            var successmessage = '';
                            if(post.status == 2){
                                var successmessage = 'My openings deleted successfully';
                            }else{
                                var successmessage = 'My openings completed successfully';
                            }
                            var sql = "UPDATE company_watchlist SET status = ?,updated_date=? WHERE id = ?";
                            connection.query(sql, [post.status,created_date, post.id], function (err, updateres) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/update", 'Mysql error in update query');
                                    res.send(response);
                                } else {
                                    response = general.response_format(true, successmessage, {}, connection, post, "company/watchlist/update", 'watchlist updated success');
                                    res.send(response);
                                }
                            });
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

/*
API for add student into watchlist
PARAM:user_id,watchlist_id,student_id
 */
router.post('/watchlist/addstudent', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','watchlist_id','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var checkwid = `SELECT * FROM company_watchlist where id=${post.watchlist_id};`
                connection.query(checkwid, function (err, checkiwddata) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "/company/watchlist/addstudent", 'Mysql error in wathclist query');
                        res.send(response);
                    } else {
                        if(checkiwddata[0].status == 1){
                            var checkdetails = `SELECT * FROM watchlist_student WHERE watchlist_id = ${post.watchlist_id} AND student_id=${post.student_id} AND status NOT IN (5,7,11,12);`
                            console.log('checkdetails',checkdetails)
                            connection.query(checkdetails, function (err, checkdetailsdata) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addstudent", 'Mysql error in check watchlist query');
                                    res.send(response);
                                } else {
                                    console.log("checkdetailsdata",checkdetailsdata)
                                    if(checkdetailsdata.length > 0){
                                        response = general.response_format(false, 'You have already added this candidate in my openings', {}, connection, post, "company/watchlist/addstudent", 'already added error');
                                        res.send(response);
                                    }else{
                                        var getstudent = `SELECT * FROM user WHERE id = ${post.student_id};`
                                    
                                        connection.query(getstudent, function (err, getstudent) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addstudent", 'Mysql error in check user query');
                                                res.send(response);
                                            } else {
                                                var current_progress_status = getstudent[0].current_progress_status;
                                                console.log("current_progress_status",current_progress_status)
                                                var is_special_candidate = getstudent[0].is_special_candidate;
                                                console.log("is_special_candidate",is_special_candidate)
                                                var sql = `INSERT INTO watchlist_student (user_id,watchlist_id,student_id,status,created_date) VALUES ?`;
                                                var values = [
                                                    [
                                                        [post.user_id,post.watchlist_id,post.student_id,1,created_date]
                                                    ]
                                                ];
                                                connection.query(sql, values, function (err, response) {
                                                    if (err) {
                                                        console.log(err)
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addstudent", 'Mysql error in insert query');
                                                        res.send(response);
                                                    } else {
                                                        //update progress status in user table
                                                        if(current_progress_status == 3){
                                                            console.log("current_progress_status1",current_progress_status)
                                                            var sql = "UPDATE user SET current_progress_status = 4 WHERE id = " + post.student_id;
                                                           
                                                            console.log("current_progress_status1sql",sql)
                                                            connection.query(sql, function (err, response) {
                                                                if (err) {
                                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addstudent", 'Mysql error in update user current progress status update query');
                                                                    res.send(response);
                                                                } else {
                                                                    response = general.response_format(true, "Candidate added to my openings", {}, connection, post, "company/watchlist/addstudent", 'Student added successfully');
                                                                    res.send(response);
                                                                }
                                                            })
                                                        }else{
                                                            response = general.response_format(true, "Candidate added to my openings", {}, connection, post, "company/watchlist/addstudent", 'Student added successfully');
                                                            res.send(response);
                                                        }
                                                        
                                                    
                                                    }
                                                })
                                            }
                                        })
                                        
                                    }
                                }
                            })
                        }else{
                            response = general.response_format(false, messages.WATCHLIST_NOT_ACTIVE, {}, connection, post, "student/offer_accept_reject", 'fullfill requirement');
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

/*
API for add company timeslot
PARAM:user_id,timeslot1,timeslot2,timeslot3
 */
router.post('/watchlist/addcompany_timeslot', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    let response = {};
    var post = req.body;
    var required_params = ['user_id', 'timeslot1','timeslot2','timeslot3'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
       
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/addcompany_timeslot", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkdetails = `SELECT * FROM company_timeslot WHERE user_id = ${post.user_id};`
                console.log('checkdetails',checkdetails)
                connection.query(checkdetails, function (err, checkdetailsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addcompany_timeslot", 'Mysql error in check timeslot query');
                        res.send(response);
                    } else {
                        console.log("checkdetailsdata",checkdetailsdata)
                        if(checkdetailsdata.length > 0){
                            var sql = "UPDATE company_timeslot SET time_slot1 = ?,time_slot2 = ?, time_slot3 = ?, updated_date =? WHERE id = ? ";
                            var values = [post.timeslot1, post.timeslot2, post.timeslot3, created_date, checkdetailsdata[0].id]
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addcompany_timeslot", 'Mysql error in update timeslot query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, 'Timeslot updated Successfully', {}, connection, post, "company/watchlist/addcompany_timeslot", "timeslot updated successfully");
                                    res.send(response);
                                }
                            })
                        }else{
                            var sql = `INSERT INTO company_timeslot (user_id,time_slot1,time_slot2,time_slot3,updated_date) VALUES ?`;
                            var values = [
                                [
                                    [post.user_id,post.timeslot1,post.timeslot2,post.timeslot3,created_date]
                                ]
                            ];
                            connection.query(sql, values, function (err, response) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/addcompany_timeslot", 'Mysql error in insert timeslot query');
                                    res.send(response);
                                } else {
                                    response = general.response_format(true, "Timeslot added successfully", {}, connection, post, "company/watchlist/addcompany_timeslot", 'Timeslot added successfully');
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
})
/*
API for get company timeslot
PARAM:user_id,company_user_id
 */
router.post('/watchlist/get_company_timeslot', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    let response = {};
    var post = req.body;
    var required_params = ['user_id','company_user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
       
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "watchlist/get_company_timeslot", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkdetails = `SELECT * FROM company_timeslot WHERE user_id = ${post.company_user_id};`
                console.log('checkdetails',checkdetails)
                connection.query(checkdetails, function (err, checkdetailsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_company_timeslot", 'Mysql error in get timeslot query');
                        res.send(response);
                    } else {
                        console.log("checkdetailsdata",checkdetailsdata)
                        if(checkdetailsdata.length > 0){
                            response = general.response_format(true, 'Success', checkdetailsdata,connection,{},"company/watchlist/get_company_timeslot",'Success');
                            res.send(response);
                        }else{
                            response = general.response_format(true, 'Success', [],connection,{},"company/watchlist/get_company_timeslot",'Success');
                            res.send(response);
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
})
/*
API for get all watchlist list 
PARAM:user_id
 */
router.post('/watchlist/get_all_watchlist', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        
        var sort = "ORDER BY u.id DESC";

        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let search_query = `u.user_id=${post.user_id} and u.status=1`;
                var searchq = `SELECT u.*, cp.career_name
                FROM company_watchlist u
                LEFT JOIN career_path cp ON cp.id=u.career_path_id
                WHERE ${search_query}  ${sort}`;
                console.log("searchq",searchq)
                var responsedata = []
                connection.query(searchq, function (err, searchq) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company//watchlist/get_all_watchlist", 'Mysql error in get select query');
                        res.send(response);
                    } else {
                        response = general.response_format(true, messages.SUCCESS, searchq, connection, post, "company//watchlist/get_all_watchlist", "watchlist data Fetched Successfully");
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
/*
API for get watchlist list 
PARAM:user_id
 */
router.post('/watchlist/get_watchlist', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
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
            if(sort_by == 'role_title'){
                var sort = " ORDER BY u.role_title"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} and u.status=1`;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.role_title && post.filtred.role_title != ""){
                        search_query += ` AND (u.role_title LIKE '%${post.filtred.role_title}%')`;
                    }
                }
                    var searchqcount = `SELECT u.*, cp.career_name
                    FROM company_watchlist u
                    LEFT JOIN career_path cp ON cp.id=u.career_path_id
                    WHERE ${search_query} `;
                
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*, cp.career_name,
                                (SELECT COUNT(*) from watchlist_student where user_id=${post.user_id} AND status = 1 AND watchlist_id=u.id) as totalstudent,
                                (SELECT COUNT(*) from watchlist_student where user_id=${post.user_id} AND status = 6 AND watchlist_id=u.id) as totalinterviewed,
                                (SELECT COUNT(*) from watchlist_student where user_id=${post.user_id} AND status = 10 AND watchlist_id=u.id) as hired
                                FROM company_watchlist u
                                LEFT JOIN career_path cp ON cp.id=u.career_path_id
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
                                            tempobj.role_title = element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.primary_contact =(element.primary_contact)?element.primary_contact:''
                                            tempobj.how_many_engineers_looking =(element.how_many_engineers_looking)?element.how_many_engineers_looking:0
                                            tempobj.salary =(element.salary)?element.salary:''
                                            tempobj.description =(element.description)?element.description:''
                                            tempobj.created_date = element.created_date
                                            tempobj.shortlisted = element.totalstudent
                                            tempobj.interviewed = element.totalinterviewed
                                            tempobj.hired = element.hired
                                            responsedata.push(tempobj)
                                        
                                            dataCB()
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                res.send(response);
                                            } else {
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*
API for get watchlist list students
PARAM:user_id,watchlist_id
 */
router.post('/watchlist/get_watchlist_students', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','watchlist_id'];
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
            if(sort_by == 'career_path'){
                var sort = " ORDER BY cp.career_name"+sort_sequence;
            }else if(sort_by == 'place'){
                var sort = " ORDER BY ct.name"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.watchlist_id=${post.watchlist_id} AND u.status=1 `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.candidatename && post.filtred.candidatename != ""){
                        search_query += ` AND (us.first_name LIKE '%${post.filtred.candidatename}%' OR us.last_name LIKE '%${post.filtred.candidatename}%')`;
                    }
                    if(post.filtred.career_path && post.filtred.career_path != ""){
                        search_query += ` AND (cp.career_name LIKE '%${post.filtred.career_path}%')`;
                    }
                    if(post.filtred.place && post.filtred.place != ""){
                        search_query += ` AND (ct.name LIKE '%${post.filtred.place}%')`;
                    }
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            
                                          
                                            var candidatekey = key+1;
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = "Candidate "+candidatekey
                                            tempobj.display_name = 0
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.place =(element.place)?element.place:''
                                            tempobj.is_got_other_company_offer = 0
                                            var sql = `SELECT * FROM user WHERE id = ${element.student_id};`
                                            connection.query(sql, function (err, offerdata) {
                                                if (err) {
                                                    dataCB(err)
                                                } else {
                                                   
                                                    tempobj.is_got_other_company_offer = (offerdata.looking_for_job==0)?1:0;
                                                    responsedata.push(tempobj)
                                                    dataCB()
                                                }
                                            })
                                            
                                        
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                                res.send(response);
                                            } else {
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*
API for sent request to student for intro discovery call
PARAM:user_id,student_id,id
 */
router.post('/watchlist/sent_intro_discovery_request', upload.array(),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log("postpost",post)
    var required_params = ['user_id', 'student_id', 'id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var currenttime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
    if (valid) {
        
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkid = `SELECT * FROM watchlist_student where id=${post.id};`
               connection.query(checkid, function (err, checkiddata) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                        connection.query(checkwid, function (err, checkiwddata) {
                            if (err) {
                                console.log("err",err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'Mysql error in wathclist query');
                                res.send(response);
                            } else {
                                if(checkiwddata[0].status == 3 || checkiwddata[0].status == 2){
                                    response = general.response_format(false, messages.WATCHLIST_NOT_ACTIVE, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'fullfill requirement');
                                    res.send(response);    
                                }else{
                                    if(checkiddata[0].status == 2){
                                        response = general.response_format(false, "You have already send intro discovery call request to this candidate", {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'already sent request');
                                        res.send(response);    

                                    }else{
                                        var sql = "UPDATE watchlist_student SET status = ?,intro_discovery_request_date=? WHERE id = ?";
                                        connection.query(sql, [2,currenttime, post.id], function (err, updateres) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'Error in update query');
                                                res.send(response);
                                            } else {
                                                var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 6;
                                                SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${post.student_id};
                                                SELECT c.* FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`;
                                                console.log(sql)

                                                connection.query(sql, function (err, email_template) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'email_template err');
                                                        res.send(response);
                                                    } else {

                                                        if(email_template[2][0].offer_any && email_template[2][0].offer_any != "")
                                                        {    
                                                            var array11 = email_template[2][0].offer_any.split(',');
                                                        }else{
                                                           var array11 = []
                                                        }
                                                        var offerany = `<ul style="display: block; margin: 0 0 30px; padding: 0; list-style: none;">`
                                                        async.forEachOf(array11, function (element, key, dataCB) {
                                                            offerany += '<li style="display: block; margin: 0 0 10px;">'+constants.OFFER_ANY[element]+'</li>'; 
                                                            dataCB()
                                                        }, function (err) {
                                                            if (err) {
                                                                offerany = ''; 
                                                            } else {
                                                                if(email_template[2][0].offer_any_other_text){
                                                                    offerany += '<li style="display: block; margin: 0 0 10px;">'+email_template[2][0].offer_any_other_text+'</li>'; 
                                                                }
                                                                
                                                                offerany += '</ul>'; 
                                                                var offerreject = constants.APP_URL+"confirm/intro_discovery_call_request/"+post.id+"/0"
                                                                var offeraccept = constants.APP_URL+"confirm/intro_discovery_call_request/"+post.id+"/1"
                                                                var userfulllname = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                                                var html = email_template[0][0].emailtemplate_body;
                                                                // var html = html.replace(/{fullname}/gi, (userfulllname) ? userfulllname : '');
                                                                // var html = html.replace(/{requestlink}/gi, requrl);


                                                                var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                                                var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                                                var html = html.replace(/{company_name}/gi, (email_template[2][0].company_name) ? email_template[2][0].company_name : '');
                                                                var html = html.replace(/{role_title}/gi, (checkiwddata[0].role_title) ? checkiwddata[0].role_title : '');
                                                                var html = html.replace(/{role_salary}/gi, (checkiwddata[0].salary) ? checkiwddata[0].salary : '');
                                                                var html = html.replace(/{role_description}/gi, (checkiwddata[0].description) ? checkiwddata[0].description : '');
                                                                var html = html.replace(/{accepturl}/gi, offeraccept);
                                                                var html = html.replace(/{rejecturl}/gi, offerreject);

                                                                var html = html.replace(/{primary_company_address}/gi, (email_template[2][0].primary_company_address) ? email_template[2][0].primary_company_address : '');
                                                                var html = html.replace(/{what_does_company_do}/gi, (email_template[2][0].what_does_company_do) ? email_template[2][0].what_does_company_do : '');
                                                                var html = html.replace(/{size_of_company}/gi, (email_template[2][0].size_of_company) ? constants.COMPANY_SIZE[email_template[2][0].size_of_company] : '');
                                                                var html = html.replace(/{company_culture}/gi, (email_template[2][0].company_culture) ? email_template[2][0].company_culture : '');
                                                                var html = html.replace(/{why_join}/gi, (email_template[2][0].why_join) ? email_template[2][0].why_join : '');
                                                                var html = html.replace(/{offer_any}/gi, (email_template[2][0].offer_any) ? offerany : '');
                                                                var html = html.replace(/{offer_any_other_text}/gi, (email_template[2][0].offer_any_other_text) ? email_template[2][0].offer_any_other_text : '');

                                                                
                                                                var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                                console.log("mail call", html)
                                                                emailservice.sendMailnew(req, data, function (result) {
                                                                    console.log("result", result)
                                                                });
                                                                response = general.response_format(true, "Request sent successfully", {}, connection, post, "company/watchlist/sent_intro_discovery_request", "Request sent for intro discovery call");
                                                                res.send(response);
                                                            
                                                            }
                                                        });
                                                        
                                
                                                    }
                                                });
                                                
                                               
                                            }
                                        });
                                    }
                                }
                            }
                        })
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
API for get all student list which request sent to student for intro discovery call
PARAM:user_id
 */
router.post('/watchlist/get_intro_discovery_request', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'request_date'){
                var sort = " ORDER BY u.intro_discovery_request_date"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status=2 `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                    if(post.filtred.request_date && post.filtred.request_date != ""){
                        var newdateonly = moment(post.filtred.request_date).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.intro_discovery_request_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }
                        
                    }
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_intro_discovery_request", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place,us.looking_for_job
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_intro_discovery_request", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            
                                          
                                            var candidatekey = key+1;
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = "Candidate "+candidatekey
                                            tempobj.display_name = 0
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.requested_date = element.intro_discovery_request_date
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_intro_discovery_request", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_intro_discovery_request", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})


/*
API for get all student list which response sent to company for intro discovery call
PARAM:user_id
 */
router.post('/watchlist/get_intro_discovery_response', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'interview_date'){
                var sort = " ORDER BY u.intro_discovery_response_on_date"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status=3 `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                    if(post.filtred.interview_date && post.filtred.interview_date != ""){
                        var newdateonly = moment(post.filtred.interview_date).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.intro_discovery_response_on_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }
                        
                    }
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_intro_discovery_response", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.intro_discovery_response_on_date, "%m/%d/%Y") as intro_discovery_response_on_date,cw.role_title, cp.career_name,ct.name as place,us.looking_for_job
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_intro_discovery_response", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            
                                          
                                            var candidatekey = key+1;
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = "Candidate "+candidatekey
                                            tempobj.display_name = 0
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.intro_discovery_response_type = element.intro_discovery_response_type
                                            tempobj.intro_discovery_response_on_date = element.intro_discovery_response_on_date
                                            tempobj.intro_discovery_response_timeslot1 = element.intro_discovery_response_timeslot1
                                            tempobj.intro_discovery_response_timeslot2 = element.intro_discovery_response_timeslot2
                                            tempobj.intro_discovery_response_timeslot3 = element.intro_discovery_response_timeslot3
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_intro_discovery_response", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_intro_discovery_response", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for confirm intro discovery call inerview timeslot response by student
Params: user_id,id,on_date,timeslot1,student_id
*/
router.post('/watchlist/confirm_intro_discovery_call_timeslot', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','id','on_date','timeslot1','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var timeslot1 = (post.timeslot1)?post.timeslot1:''
      
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
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/confirm_intro_discovery_call_timeslot", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                        connection.query(checkwid, function (err, checkiwddata) {
                            if (err) {
                                console.log("err",err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/confirm_intro_discovery_call_timeslot", 'Mysql error in wathclist query');
                                res.send(response);
                            } else {
                                if(checkiwddata[0].status == 3 || checkiwddata[0].status == 2){
                                    response = general.response_format(false, messages.WATCHLIST_NOT_ACTIVE, {}, connection, post, "company/watchlist/confirm_intro_discovery_call_timeslot", 'fullfill requirement');
                                    res.send(response);    
                                }else{
                                    if(checkiddata[0].status == 4){
                                        response = general.response_format(false, "You have already confirm intro discovery call timeslot", {}, connection, post, "company/watchlist/confirm_intro_discovery_call_timeslot", 'already confirm timeslot');
                                        res.send(response);    

                                    }else{
                                        var sql = "UPDATE watchlist_student SET status = ?,intro_discovery_response_on_date = ?,intro_discovery_confirm_on_date=?,intro_discovery_confirm_timeslot1=?,general_date=?,general_time=? WHERE id = ?";
                                        connection.query(sql, [4,post.on_date,post.on_date,timeslot1,post.on_date,timeslot1, post.id], function (err, updateres) {
                                            if (err) {
                                                console.log("err",err)
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/confirm_intro_discovery_call_timeslot", 'Error in update query');
                                                res.send(response);
                                            } else {
                                                var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 7;
                                                SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${post.student_id};
                                                SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`;

                                                console.log(sql)
                                                connection.query(sql, function (err, email_template) {
                                                    if (err) {
                                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/confirm_intro_discovery_call_timeslot", 'email_template err');
                                                        res.send(response);
                                                    } else {
                                                        var newdateonly = moment(post.on_date).format('MM-DD-YYYY')
                                                        var customdate = newdateonly+' '+post.timeslot1
                                                        var html = email_template[0][0].emailtemplate_body;
                                                        var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                                        var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                                        var html = html.replace(/{company_name}/gi, (email_template[2][0].company_name) ? email_template[2][0].company_name : '');
                                                        var html = html.replace(/{watchlist_name}/gi, checkiwddata[0].role_title);
                                                        var html = html.replace(/{date_time}/gi, customdate);
                                                       // var html = html.replace(/{ontime}/gi, post.timeslot1);
                                                        
                                                        var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                        console.log("mail call", html)
                                                        emailservice.sendMailnew(req, data, function (result) {
                                                            console.log("result", result)
                                                        });
                                                        response = general.response_format(true, "Request confirm successfully", {}, connection, post, "cstudent/confirm_intro_discovery_call_timeslot", "Data updated successfully");
                                                        res.send(response);
                                
                                                    }
                                                });
                                               
                                               
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

/*
API for get all student list which confirm for intro discovery call
PARAM:user_id
 */
router.post('/watchlist/get_intro_discovery_confirm', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.general_date DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'place'){
                var sort = " ORDER BY ct.name"+sort_sequence;
            }else if(sort_by == 'interview_date'){
                var sort = " ORDER BY u.general_date"+sort_sequence;
            }else if(sort_by == 'interview_time'){
                var sort = " ORDER BY u.general_time"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status=4 `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                    if(post.filtred.place && post.filtred.place != ""){
                        search_query += ` AND (ct.name LIKE '%${post.filtred.place}%')`;
                    }
                    if(post.filtred.interview_date && post.filtred.interview_date != ""){
                        var newdateonly = moment(post.filtred.interview_date).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.general_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }
                        
                    }
                    if(post.filtred.interview_time && post.filtred.interview_time != ""){
                       
                            search_query += ` AND (u.general_time LIKE '%${post.filtred.interview_time}%')`;
                        
                    }
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name,us.looking_for_job
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_intro_discovery_confirm", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.general_date, "%m/%d/%Y") as general_date,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name,us.looking_for_job
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_intro_discovery_confirm", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            var candidatekey = key+1;
                                            //check if interview within 24 hour then display name
                                            var intortime = moment(element.general_date,'YYYY-MM-DD').format('YYYY-MM-DD');
                                            let confirmdate = intortime+' '+element.general_time
                                            //var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                            var currenttime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                                            var resettime = moment(confirmdate,'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss');
                                            var diff = moment.duration(moment(resettime).diff(moment(currenttime))).asMinutes();
                                            console.log("Result :",confirmdate,resettime,diff)
                                            var tempobj = {}
                                            if(diff < 1440){
                                               var candidatename = element.first_name+' '+element.last_name
                                               tempobj.display_name = 1
                                            }else{
                                               var candidatename = "Candidate "+candidatekey
                                               tempobj.display_name = 0
                                            }
                                            
                                            tempobj.id = element.id
                                            tempobj.candidatename = candidatename
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.place =element.place
                                            tempobj.intro_discovery_response_on_date = element.general_date
                                            tempobj.intro_discovery_response_on_time = element.general_time
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_intro_discovery_confirm", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_intro_discovery_confirm", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for pass/fail candidate in intro discovery call inerview
Params: user_id,id,student_id,status,remark if fail
status : 0=fail, 1=pass
*/
router.post('/watchlist/pass_fail_intro_discovery_call', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','status','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var remark = (post.remark)?post.remark:''
        var status = (post.status == 0)?5:6
        var onsite_interview_date = (post.onsiteinterviewdate)?post.onsiteinterviewdate : '';
        var onsite_interview_time = (post.onsiteinterviewtime)?post.onsiteinterviewtime:''; 
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
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                        connection.query(checkwid, function (err, checkiwddata) {
                            if (err) {
                                console.log("err",err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'Mysql error in wathclist query');
                                res.send(response);
                            } else {
                                if(checkiwddata[0].status == 3 || checkiwddata[0].status == 2){
                                    response = general.response_format(false, messages.WATCHLIST_NOT_ACTIVE, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'fullfill requirement');
                                    res.send(response);    
                                }else{
                                    if(checkiddata[0].status == 5){
                                        response = general.response_format(false, "You have already fail this candidate", {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'already fail student');
                                        res.send(response);    

                                    }else if(checkiddata[0].status == 6){
                                        response = general.response_format(false, "You have already pass this candidate", {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'already pass studnet');
                                        res.send(response);    

                                    }else{
                                        var sql = "UPDATE watchlist_student SET status = ?,intro_discovery_failed_remark=?,onsite_interview_date=?,onsite_interview_time=?,general_date=?,general_time=? WHERE id = ?";
                                        connection.query(sql, [status,remark,onsite_interview_date,onsite_interview_time,onsite_interview_date,onsite_interview_time, post.id], function (err, updateres) {
                                            if (err) {
                                                console.log("err",err)
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/pass_fail_intro_discovery_call", 'Error in update query');
                                                res.send(response);
                                            } else {
                                                if(status == 5){
                                                    var templateid = 9;
                                                    var resmessage = 'Candidate set as fail successfully';
                                                }else{
                                                    var templateid = 10;
                                                    var resmessage = 'Candidate set as pass successfully';
                                                }
                                                var newdateonly = moment(checkiddata[0].general_date).format('MM-DD-YYYY')
                                   
                                                var customdate = newdateonly+' '+checkiddata[0].general_time
                                                // var d = new Date(newdate);
                                                // var customdate = momentzone(d).tz("America/Los_Angeles").format("MM-DD-YYYY h:mm A");
                                                console.log("customdate",customdate)
                                               
                                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = ${templateid};
                                                    SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${post.student_id};
                                                    SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`;
                                                    console.log(sql)
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'email_template err');
                                                            res.send(response);
                                                        } else {
                                                            
                                                           var html = email_template[0][0].emailtemplate_body;
                                                            
                                                            var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                                            var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                                            var html = html.replace(/{company_name}/gi, (email_template[2][0].company_name) ? email_template[2][0].company_name : '');
                                                            var html = html.replace(/{role_title}/gi, checkiwddata[0].role_title);
                                                            var html = html.replace(/{date_time}/gi, customdate);
                                                            if(status == 5){
                                                                var html = html.replace(/{remark}/gi, remark);
                                                            }
                                                            var html = html.replace(/{customlink}/gi, constants.APP_URL);
                                                            

                                                            var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                            console.log("mail call", html)
                                                            emailservice.sendMailnew(req, data, function (result) {
                                                                console.log("result", result)
                                                            });
                                                            response = general.response_format(true, resmessage, {}, connection, post, "cstudent/pass_fail_intro_discovery_call", "Data updated successfully");
                                                            res.send(response);
                                    
                                                        }
                                                    });
                                                
                                                
                                            
                                            
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

/*
API for get all student list which passed into intro discovery call list - onsite list
PARAM:user_id
 */
router.post('/watchlist/get_onsite_intro_discovery_call_list', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'place'){
                var sort = " ORDER BY ct.name"+sort_sequence;
            }else if(sort_by == 'candidate'){
                var sort = " ORDER BY us.first_name"+sort_sequence;
            }else if(sort_by == 'interview_date'){
                var sort = " ORDER BY u.general_date"+sort_sequence;
            }else if(sort_by == 'interview_time'){
                var sort = " ORDER BY u.general_time"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status=6 `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                    if(post.filtred.place && post.filtred.place != ""){
                        search_query += ` AND (ct.name LIKE '%${post.filtred.place}%')`;
                    }
                    if(post.filtred.candidate && post.filtred.candidate != ""){
                        search_query += ` AND (us.first_name LIKE '%${post.filtred.candidate}%' || us.last_name LIKE '%${post.filtred.candidate}%')`;
                    }
                    if(post.filtred.interview_date && post.filtred.interview_date != ""){
                        var newdateonly = moment(post.filtred.interview_date).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.general_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }
                        
                    }
                    if(post.filtred.interview_time && post.filtred.interview_time != ""){
                       
                            search_query += ` AND (u.general_time LIKE '%${post.filtred.interview_time}%')`;
                        
                    }
                    
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_onsite_intro_discovery_call_list", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.general_date, "%m/%d/%Y") as general_date,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name,us.looking_for_job
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_onsite_intro_discovery_call_list", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            var candidatekey = key+1;
                                            //check if interview within 24 hour then display name
                                            // var intortime = moment(element.intro_discovery_confirm_on_date,'YYYY-MM-DD').format('YYYY-MM-DD');
                                            // let confirmdate = intortime+' '+element.intro_discovery_confirm_timeslot1
                                            // var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                            // var resettime = moment(confirmdate,'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss');
                                            // var diff = moment.duration(moment(resettime).diff(moment(currenttime))).asMinutes();
                                            // console.log("Result :",confirmdate,resettime,diff)
                                            // if(diff < 1440){
                                            //    var candidatename = element.first_name+' '+element.last_name
                                            // }else{
                                            //    var candidatename = "Candidate "+candidatekey
                                            // }
                                            var candidatename = element.first_name+' '+element.last_name
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = candidatename
                                            tempobj.display_name = 1
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.place =element.place
                                            tempobj.intro_discovery_response_on_date = element.general_date
                                            tempobj.intro_discovery_response_on_time = element.general_time
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_onsite_intro_discovery_call_list", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_onsite_intro_discovery_call_list", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for pass/fail candidate in onsite intro discovery inerview
Params: user_id,id,student_id,status,remark if fail
status : 0=fail, 1=pass
*/
router.post('/watchlist/pass_fail_onsite_intro_discovery_call', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['id','user_id','status','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        
        var onsite_interview_date = (post.onsiteinterviewdate)?post.onsiteinterviewdate : '';
        var onsite_interview_time = (post.onsiteinterviewtime)?post.onsiteinterviewtime:'';
        console.log("CHECK:",post.change_date  && post.change_date == '1',post.change_date) 
        if(post.change_date && post.change_date == '1'){
            req.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                    res.send(response);
                } else {
                    var sql = "UPDATE watchlist_student SET onsite_interview_date=?,onsite_interview_time=?,general_date=?,general_time=? WHERE id = ?";
                    console.log("SQL::",sql)
                    connection.query(sql, [onsite_interview_date,onsite_interview_time,onsite_interview_date,onsite_interview_time, post.id], function (err, updateres) {
                        console.log("SQL::",this.sql)                        
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "student/pass_fail_onsite_intro_discovery_call", 'Error in update query');
                            res.send(response);
                        } else {
                            response = general.response_format(true, "Interview date changed successfully.", {}, connection, post, "student/pass_fail_onsite_intro_discovery_call", "Data updated successfully");
                            res.send(response);
                        }
                    })  
                }
            })      
        }else{
            console.log("IN ELSEE::")
            var remark = (post.remark)?post.remark:''
        var status = (post.status == 0)?7:8
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
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/sent_intro_discovery_request", 'Mysql error in watchlist student query');
                        res.send(response);
                    } else {
                        var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                        connection.query(checkwid, function (err, checkiwddata) {
                            if (err) {
                                console.log("err",err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'Mysql error in wathclist query');
                                res.send(response);
                            } else {
                                if(checkiwddata[0].status == 3 || checkiwddata[0].status == 2){
                                    response = general.response_format(false, messages.WATCHLIST_NOT_ACTIVE, {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'fullfill requirement');
                                    res.send(response);    
                                }else{
                                    if(checkiddata[0].status == 7){
                                        response = general.response_format(false, "You have already fail this candidate", {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'already fail student');
                                        res.send(response);    

                                    }else if(checkiddata[0].status == 8){
                                        response = general.response_format(false, "You have already pass this candidate", {}, connection, post, "company/watchlist/pass_fail_intro_discovery_call", 'already pass studnet');
                                        res.send(response);    

                                    }else{
                                        var sql = "UPDATE watchlist_student SET status = ?,onsite_discovery_failed_remark=? WHERE id = ?";
                                        connection.query(sql, [status,remark, post.id], function (err, updateres) {
                                            if (err) {
                                                console.log("err",err)
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "student/pass_fail_onsite_intro_discovery_call", 'Error in update query');
                                                res.send(response);
                                            } else {
                                                if(status == 7){
                                                    var templateid = 11;
                                                    var resmessage = 'Candidate set as fail successfully';
                                                }else{
                                                    var templateid = 12;
                                                    var resmessage = 'Candidate set as pass successfully';
                                                }
                                                    var sql = `SELECT * FROM email_template WHERE emailtemplate_id = ${templateid};
                                                    SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${post.student_id};
                                                    SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`;
                                                    console.log(sql)
                                                    connection.query(sql, function (err, email_template) {
                                                        if (err) {
                                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_onsite_intro_discovery_call", 'email_template err');
                                                            res.send(response);
                                                        } else {
                                                            if(checkiddata[0].general_date){	
                                                                var newdateonly = moment(checkiddata[0].general_date).format('MM-DD-YYYY')	
                                                                var customdate = newdateonly+' '+checkiddata[0].general_time	
                                                            }else{	
                                                                var customdate = "";	
                                                            }
                                                            var userfulllname = email_template[1][0].first_name+" "+email_template[1][0].last_name
                                                            var html = email_template[0][0].emailtemplate_body;
                                                            var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                                            var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                                            var html = html.replace(/{company_name}/gi, (email_template[2][0].company_name) ? email_template[2][0].company_name : '');
                                                            var html = html.replace(/{role_title}/gi, checkiwddata[0].role_title);
                                                            var html = html.replace(/{customdate}/gi, customdate);
                                                            if(status == 7){
                                                                var html = html.replace(/{remark}/gi, remark);
                                                            }
                                                            var html = html.replace(/{customlink}/gi, constants.APP_URL);

                                                            var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                            console.log("mail call", html)
                                                            emailservice.sendMailnew(req, data, function (result) {
                                                                console.log("result", result)
                                                            });
                                                            response = general.response_format(true, resmessage, {}, connection, post, "cstudent/pass_fail_onsite_intro_discovery_call", "Data updated successfully");
                                                            res.send(response);
                                    
                                                        }
                                                    });

                                                
                                            
                                            
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
        }        
    }  else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*
API for get all student list which passed into intro discovery call list - onsite list
PARAM:user_id
 */
router.post('/watchlist/get_offer_extended_list', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'candidate'){
                var sort = " ORDER BY us.first_name"+sort_sequence;
            }else if(sort_by == 'interview_date'){
                var sort = " ORDER BY u.general_date"+sort_sequence;
            }else if(sort_by == 'offer_date'){
                var sort = " ORDER BY u.offer_date"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status IN(9,14) `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                   
                    if(post.filtred.candidate && post.filtred.candidate != ""){
                        search_query += ` AND (us.first_name LIKE '%${post.filtred.candidate}%' || us.last_name LIKE '%${post.filtred.candidate}%')`;
                    }
                    if(post.filtred.interview_date && post.filtred.interview_date != ""){
                        var newdateonly = moment(post.filtred.interview_date).format('YYYY-MM-DD')
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
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                    WHERE ${search_query}  `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_offer_extended_list", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.general_date, "%m/%d/%Y") as general_date,DATE_FORMAT(u.offer_date, "%m/%d/%Y") as offer_date,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name,us.looking_for_job
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_offer_extended_list", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            var candidatekey = key+1;
                                            
                                            var candidatename = element.first_name+' '+element.last_name
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = candidatename
                                            tempobj.display_name = 1
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.place =element.place
                                            tempobj.intro_discovery_response_on_date = element.general_date
                                            tempobj.is_offer_sent = (element.status==9)?1:0
                                            tempobj.offer_date = (element.offer_date)?element.offer_date:''
                                            tempobj.offer_note = (element.offer_note)?element.offer_note:''
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_offer_extended_list", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_offer_extended_list", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})


/*
API for get all student list which confirmed the offer - confirmed offer list
PARAM:user_id
 */
router.post('/watchlist/get_offer_confirmed_list', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'candidate'){
                var sort = " ORDER BY us.first_name"+sort_sequence;
            }else if(sort_by == 'interview_date'){
                var sort = " ORDER BY u.general_date"+sort_sequence;
            }else if(sort_by == 'offer_date'){
                var sort = " ORDER BY u.offer_date"+sort_sequence;
            }else if(sort_by == 'location'){
                var sort = " ORDER BY ct.name"+sort_sequence;
            }else if(sort_by == 'is_offer_sent'){
                var sort = " ORDER BY u.offer_confirm_date"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status = 10`;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                   
                    if(post.filtred.candidate && post.filtred.candidate != ""){
                        search_query += ` AND (us.first_name LIKE '%${post.filtred.candidate}%' || us.last_name LIKE '%${post.filtred.candidate}%')`;
                    }
                    if(post.filtred.interview_date && post.filtred.interview_date != ""){
                        var newdateonly = moment(post.filtred.interview_date).format('YYYY-MM-DD')
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
                    if(post.filtred.is_offer_sent && post.filtred.is_offer_sent != ""){
                        var newdateonly = moment(post.filtred.is_offer_sent).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.offer_confirm_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }
                        
                    }
                    if(post.filtred.location && post.filtred.location != ""){
                        search_query += ` AND (ct.name LIKE '%${post.filtred.location}%' || ct.name LIKE '%${post.filtred.location}%')`;
                    }
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_offer_confirmed_list", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.general_date, "%m/%d/%Y") as general_date,DATE_FORMAT(u.offer_date, "%m/%d/%Y") as offer_date,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name,us.looking_for_job
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_offer_confirmed_list", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            var candidatekey = key+1;
                                            
                                            var candidatename = element.first_name+' '+element.last_name
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = candidatename
                                            tempobj.display_name = 1
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.place =element.place
                                            tempobj.intro_discovery_response_on_date = element.general_date
                                            tempobj.offer_date = (element.offer_date)?element.offer_date:''
                                            tempobj.offer_confirm_date = (element.offer_confirm_date)?element.offer_confirm_date:''
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_offer_confirmed_list", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_offer_confirmed_list", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*api for send offer to candidate
Params: user_id,id,student_id,note
*/
router.post('/watchlist/send_offer_to_candidate', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var currenttime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
    var required_params = ['user_id','note','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        var note = (post.note)?post.note:''
        var status = 9
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var checkdetails = `SELECT * FROM watchlist_student WHERE id = ${post.id};`
                console.log('checkdetails',checkdetails)
                connection.query(checkdetails, function (err, checkdetailsdata) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/send_offer_to_candidate", 'Mysql error in get watchlist student query');
                        res.send(response);
                    } else {
                        console.log("checkdetailsdata",checkdetailsdata)
                        if(checkdetailsdata[0].status >= 9 && checkdetailsdata[0].status != 13 && checkdetailsdata[0].status != 14){
                            response = general.response_format(false, 'You have already sent the offer to this candidate', {}, connection, post, "company/watchlist/send_offer_to_candidate", 'You have already sent the offer to this candidate');
                            res.send(response);
                        }else{
                            var sql = "UPDATE watchlist_student SET status = ?,offer_date=?,offer_note=? WHERE id = ?";
                            connection.query(sql, [status,currenttime,note, post.id], function (err, updateres) {
                                if (err) {
                                    console.log("err",err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/send_offer_to_candidate", 'Error in update query');
                                    res.send(response);
                                } else {
                                        var sql = `SELECT * FROM email_template WHERE emailtemplate_id = 13;
                                        SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${post.student_id};
                                        SELECT * FROM company_watchlist WHERE id = ${checkdetailsdata[0].watchlist_id};
                                        SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkdetailsdata[0].user_id}';`;
                                        console.log(sql)
                                        connection.query(sql, function (err, email_template) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/send_offer_to_candidate", 'email_template err');
                                                res.send(response);
                                            } else {
                                                var offeraccept = constants.APP_URL+"confirm/offer/"+post.id+"/1"
                                                var offerreject = constants.APP_URL+"confirm/offer/"+post.id+"/0"
                                              
                                                var html = email_template[0][0].emailtemplate_body;
                                                var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                                var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                                var html = html.replace(/{company_name}/gi, (email_template[3][0].company_name) ? email_template[3][0].company_name : '');
                                                var html = html.replace(/{role_title}/gi, (email_template[2][0].role_title) ? email_template[2][0].role_title : '');
                                                var html = html.replace(/{role_salary}/gi, (email_template[2][0].salary) ? email_template[2][0].salary : '');
                                                var html = html.replace(/{offer_notes}/gi, (note) ? note : '');
                                                var html = html.replace(/{role_description}/gi, (email_template[2][0].description) ? email_template[2][0].description : '');
                                                var html = html.replace(/{accepturl}/gi, offeraccept);
                                                var html = html.replace(/{rejecturl}/gi, offerreject);
                                            
                                                var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                console.log("mail call", html)
                                                emailservice.sendMailnew(req, data, function (result) {
                                                    console.log("result", result)
                                                });
                                                response = general.response_format(true, "Offer send successfully", {}, connection, post, "cstudent/send_offer_to_candidate", "Data updated successfully");
                                                res.send(response);
                        
                                            }
                                        });
                                    
                                }
                            });
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

/*
API for get all student list which final round list
PARAM:user_id
 */
router.post('/watchlist/get_final_round_list', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {
    
    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        post.page_size = (post.page_size)?post.page_size:constants.PAGE_SIZE;
        var page = (post.page)?post.page:0;
        var limit =  post.page_size;
        limit = ((page*post.page_size))+','+(post.page_size)
       
        var sort = "ORDER BY u.id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            if(sort_by == 'watchlist'){
                var sort = " ORDER BY cw.role_title"+sort_sequence;
            }else if(sort_by == 'place'){
                var sort = " ORDER BY ct.name"+sort_sequence;
            }else if(sort_by == 'candidate'){
                var sort = " ORDER BY us.first_name"+sort_sequence;
            }else if(sort_by == 'interview_date'){
                var sort = " ORDER BY u.general_date"+sort_sequence;
            }else if(sort_by == 'interview_time'){
                var sort = " ORDER BY u.general_time"+sort_sequence;
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
                let search_query = `u.user_id=${post.user_id} AND u.status=8 `;
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.watchlist && post.filtred.watchlist != ""){
                        search_query += ` AND (cw.role_title LIKE '%${post.filtred.watchlist}%')`;
                    }
                    if(post.filtred.place && post.filtred.place != ""){
                        search_query += ` AND (ct.name LIKE '%${post.filtred.place}%')`;
                    }
                    if(post.filtred.candidate && post.filtred.candidate != ""){
                        search_query += ` AND (us.first_name LIKE '%${post.filtred.candidate}%' || us.last_name LIKE '%${post.filtred.candidate}%')`;
                    }
                    if(post.filtred.interview_date && post.filtred.interview_date != ""){
                        var newdateonly = moment(post.filtred.interview_date).format('YYYY-MM-DD')
                        console.log("newdateonly",newdateonly)
                        if(newdateonly){
                            search_query += ` AND (DATE_FORMAT(u.general_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                        }
                        
                    }
                    if(post.filtred.interview_time && post.filtred.interview_time != ""){
                       
                            search_query += ` AND (u.general_time LIKE '%${post.filtred.interview_time}%')`;
                        
                    }
                }
                    var searchqcount = `SELECT u.*,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name
                    FROM watchlist_student u
                    LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                    LEFT JOIN user us ON us.id=u.student_id 
                    LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                    LEFT JOIN career_path cp ON cp.id=us.career_path_id
                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                    WHERE ${search_query} `;
                    console.log("searchqcount",searchqcount)
                    var responsedata = []
                    connection.query(searchqcount, function (err, searchqcount) {
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_final_round_list", 'Mysql error in totalcount query');
                            res.send(response);
                        } else {
                            var totalrow = searchqcount.length;
                            var searchq = `SELECT u.*,DATE_FORMAT(u.general_date, "%m/%d/%Y") as general_date,cw.role_title, cp.career_name,ct.name as place,us.first_name,us.last_name
                            FROM watchlist_student u
                            LEFT JOIN company_watchlist cw ON cw.id=u.watchlist_id 
                            LEFT JOIN user us ON us.id=u.student_id 
                            LEFT JOIN student_details sd ON sd.user_id=u.student_id 
                            LEFT JOIN career_path cp ON cp.id=us.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
                            WHERE ${search_query} ${sort} LIMIT ${limit}`;
                                console.log("searchq",searchq)
                                var responsedata = []
                                connection.query(searchq, function (err, searchq) {
                                    if (err) {
                                        console.log("err2",err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/get_final_round_list", 'Mysql error in select query');
                                        res.send(response);
                                    } else {
                                        console.log("searchq",searchq)
                                        async.forEachOf(searchq, function (element, key, dataCB) {
                                            var candidatekey = key+1;

                                            var candidatename = element.first_name+' '+element.last_name
                                            var tempobj = {}
                                            tempobj.id = element.id
                                            tempobj.candidatename = candidatename
                                            tempobj.student_id = element.student_id
                                            tempobj.watchlistname =element.role_title
                                            tempobj.career_path =element.career_name
                                            tempobj.place =element.place
                                            tempobj.intro_discovery_response_on_date = element.general_date
                                            tempobj.intro_discovery_response_on_time = element.general_time
                                            tempobj.is_got_other_company_offer = (element.looking_for_job==0)?1:0;
                                            responsedata.push(tempobj)
                                            dataCB()
                                            
                                        }, function (err) {
                                            if (err) {
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "fcompany/watchlist/get_final_round_list", 'Mysql error in async series');
                                                res.send(response);
                                            } else {
                                                var data = {
                                                    total: totalrow,
                                                    data: (responsedata.length > 0) ? responsedata : []
                                                };
                                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "company/watchlist/get_final_round_list", "data Fetched Successfully");
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
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

/*
API for pass/fail candidate in Phone Screening inerview and In-Process and Final Round and Move To Offer
Params: user_id,id,student_id,status,remark if fail
status : 0=fail, 1=pass
*/
router.post('/watchlist/pass_fail_current_interviews', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['id','user_id','current_status','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {        
        var onsite_interview_date = (post.onsiteinterviewdate)?post.onsiteinterviewdate : '';
        var onsite_interview_time = (post.onsiteinterviewtime)?post.onsiteinterviewtime:'';
        console.log("CHECK:", post.change_date  && post.change_date == '1', post.change_date) 
        if(post.change_date && post.change_date == '1'){
            req.getConnection(function (err, connection) {
                if (err) {
                    console.log(err);
                    response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                    res.send(response);
                } else {
                    if(post.current_status && post.current_status == 8) {
                        var sql = "UPDATE watchlist_student SET final_round_date=?,final_round_time=?,general_date=?,general_time=? WHERE id = ?";
                    } else {
                        var sql = "UPDATE watchlist_student SET onsite_interview_date=?,onsite_interview_time=?,general_date=?,general_time=? WHERE id = ?";
                    }        
                    console.log("SQL::",sql)
                    connection.query(sql, [onsite_interview_date,onsite_interview_time,onsite_interview_date,onsite_interview_time, post.id], function (err, updateres) {
                        console.log("SQL::",this.sql)                        
                        if (err) {
                            console.log("err",err)
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'Error in update query');
                            res.send(response);
                        } else {
                            response = general.response_format(true, "Interview date changed successfully.", {}, connection, post, "company/watchlist/pass_fail_current_interviews", "Data updated successfully");
                            res.send(response);
                        }
                    })  
                }
            })      
        }else{
            console.log("IN ELSEE::")
            var remark = (post.remark)?post.remark:''
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
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'Mysql error in watchlist student query');
                            res.send(response);
                        } else {
                            var checkwid = `SELECT * FROM company_watchlist where id=${checkiddata[0].watchlist_id};`
                            connection.query(checkwid, function (err, checkiwddata) {
                                if (err) {
                                    console.log("err",err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'Mysql error in wathclist query');
                                    res.send(response);
                                } else {
                                    if(checkiwddata[0].status == 3 || checkiwddata[0].status == 2){
                                        response = general.response_format(false, messages.WATCHLIST_NOT_ACTIVE, {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'fullfill requirement');
                                        res.send(response);    
                                    }else{
                                        if(post.current_status && post.new_status && post.current_status == post.new_status){
                                            response = general.response_format(false, "Please select other status both status are same", {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'both status same');
                                            res.send(response);

                                        }else if(post.new_status == checkiddata[0].status && (checkiddata[0].status == 5 || checkiddata[0].status == 7 || checkiddata[0].status == 13)){
                                            response = general.response_format(false, "You have already fail this candidate", {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'already fail student');
                                            res.send(response);    

                                        }else if(post.new_status == checkiddata[0].status && (checkiddata[0].status == 6 || checkiddata[0].status == 8 || checkiddata[0].status == 14)){
                                            response = general.response_format(false, "You have already pass this candidate", {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'already pass studnet');
                                            res.send(response);    

                                        }else{
                                            if(post.new_status && post.new_status == 5) {
                                                var sql = "UPDATE watchlist_student SET status = ?,intro_discovery_failed_remark=?  WHERE id = ?";
                                                var values = [post.new_status, remark, post.id]

                                            } else if(post.new_status && post.new_status == 7) {
                                                var sql = "UPDATE watchlist_student SET status = ?,onsite_discovery_failed_remark=? WHERE id = ?";
                                                var values = [post.new_status, remark, post.id]

                                            } else if(post.new_status && post.new_status == 13) {
                                                var sql = "UPDATE watchlist_student SET status = ?,final_round_failed_remark=? WHERE id = ?";
                                                var values = [post.new_status, remark, post.id]

                                            } else if(post.new_status && post.new_status == 6) {
                                                var sql = "UPDATE watchlist_student SET status = ?,onsite_interview_date=?,onsite_interview_time=?,general_date=?,general_time=? WHERE id = ?";
                                                var values = [post.new_status, onsite_interview_date, onsite_interview_time, onsite_interview_date, onsite_interview_time, post.id]                             
                                            
                                            } else if(post.new_status && post.new_status == 8) {
                                                var sql = "UPDATE watchlist_student SET status = ?,final_round_date=?,final_round_time=?,general_date=?,general_time=? WHERE id = ?";
                                                var values = [post.new_status, onsite_interview_date, onsite_interview_time, onsite_interview_date, onsite_interview_time, post.id]

                                            } else {
                                                var sql = "UPDATE watchlist_student SET status = ? WHERE id = ?";
                                                var values = [post.new_status, post.id]
                                            }
                                            connection.query(sql, values, function (err, updateres) {
                                                if (err) {
                                                    console.log("err",err)
                                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "student/pass_fail_current_interviews", 'Error in update query');
                                                    res.send(response);
                                                } else {                                                    
                                                    if(post.new_status == 5 || post.new_status == 7 || post.new_status == 13){
                                                        var templateid = (post.new_status == 5) ? 9 : (post.new_status == 7) ? 11 : 20;
                                                        var resmessage = 'Candidate set as fail successfully';
                                                    }else{
                                                        var templateid = (post.new_status == 6) ? 10: (post.new_status == 8) ? 12 : 21;
                                                        var resmessage = 'Candidate set as pass successfully';
                                                    }
                                                        var sql = `SELECT * FROM email_template WHERE emailtemplate_id = ${templateid};
                                                        SELECT u.first_name,u.last_name,u.email FROM user u WHERE u.id = ${post.student_id};
                                                        SELECT c.company_name FROM user u LEFT JOIN company c ON c.id=u.company_id WHERE u.id = '${checkiddata[0].user_id}' ;`;
                                                        console.log(sql)
                                                        connection.query(sql, function (err, email_template) {
                                                            if (err) {
                                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "company/watchlist/pass_fail_current_interviews", 'email_template err');
                                                                res.send(response);
                                                            } else {
                                                            	if(checkiddata[0].general_date){
                                                                    var newdateonly = moment(checkiddata[0].general_date).format('MM-DD-YYYY')	
                                                                    var customdate = newdateonly+' '+checkiddata[0].general_time
                                                                }else{	
                                                                    var customdate = "";	
                                                                }

                                                                console.log("customdate", customdate)

                                                                var html = email_template[0][0].emailtemplate_body;

                                                                var html = html.replace(/{first_name}/gi, (email_template[1][0].first_name) ? email_template[1][0].first_name : '');
                                                                var html = html.replace(/{last_name}/gi, (email_template[1][0].last_name) ? email_template[1][0].last_name : '');
                                                                var html = html.replace(/{company_name}/gi, (email_template[2][0].company_name) ? email_template[2][0].company_name : '');
                                                                var html = html.replace(/{role_title}/gi, checkiwddata[0].role_title);
                                                                if(post.new_status == 5 || post.new_status == 6) {
                                                                    var html = html.replace(/{date_time}/gi, customdate);
                                                                } else {
                                                                    var html = html.replace(/{customdate}/gi, customdate);
                                                                }                                   
                                                                if(post.new_status == 5 || post.new_status == 7 || post.new_status == 13){
                                                                    var html = html.replace(/{remark}/gi, remark);
                                                                }
                                                                var html = html.replace(/{customlink}/gi, constants.APP_URL);

                                                                var data = { to: email_template[1][0].email, subject: email_template[0][0].emailtemplate_subject, html: html };
                                                                console.log("mail call", html)
                                                                emailservice.sendMailnew(req, data, function (result) {
                                                                    console.log("result", result)
                                                                });
                                                                response = general.response_format(true, resmessage, {}, connection, post, "cstudent/pass_fail_current_interviews", "Data updated successfully");
                                                                res.send(response);
                                        
                                                            }
                                                        });                                                  
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
        }        
    }  else {
        console.log("#test");
        var str = functions.loadErrorTemplate(elem);
        console.log("#test", str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test", response);

        res.send(response);
    }
})

module.exports = router;

