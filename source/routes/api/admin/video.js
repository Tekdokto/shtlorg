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
router.post('/video/getvideonew', upload.array(),functions.verifyTokenAdmin, function (req, res) {
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
        var sort = "ORDER BY video_order ASC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            
            if(sort_by == 'video_title'){
                var sort = " ORDER BY video_title "+sort_sequence;
            }else if(sort_by == 'created_date'){
                var sort = " ORDER BY created_date"+sort_sequence;
            }else if(sort_by == 'video_order'){
                var sort = " ORDER BY video_order"+sort_sequence;
            }else{
                var sort = " ORDER BY "+sort_by+sort_sequence;
            }
        }
        if(post.filtred && Object.keys(post.filtred).length > 0){
            if(post.filtred.video_title && post.filtred.video_title != ""){
             
                search_query += ` AND (video_title like '%${post.filtred.video_title}%')`;
            }
            if(post.filtred.video_order && post.filtred.video_order != ""){
             
                search_query += ` AND (video_order like '%${post.filtred.video_order}%')`;
            }
            if(post.filtred.created_date && post.filtred.created_date != ""){
                var newdateonly = moment(post.filtred.created_date).format('YYYY-MM-DD')
                console.log("newdateonly",newdateonly)
                if(newdateonly){
                    search_query += ` AND (DATE_FORMAT(created_date, '%Y-%m-%d') LIKE '%${newdateonly}%')`;
                }
                
            }
            
           
        }
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/video/getvideonew", 'Datebase Connection error');
                res.send(response);
            } else {
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND id = ${post.id}`;
                }
                var count_sql = `SELECT COUNT(*) AS total FROM videos WHERE status != ? ${search_query} ${sort}`;
                connection.query(count_sql, [2], function (err, rows) {
                   console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/getvideonew", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT id,video_title,video_url,video_order,status,DATE_FORMAT(created_date, "%m/%d/%Y") as created_date FROM videos WHERE status != ?  ${search_query} ${sort} LIMIT ${limit}`;
                        
                        connection.query(sql, [2], function (err, result) {
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/getvideonew", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/video/getvideonew", "Video Data Fetched Successfully");
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
router.post('/video/changestatus', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/video/changestatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE videos SET status = ? WHERE id = ?";
                connection.query(sql, [post.status, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/changestatus", 'Error in update query');
                        res.send(response);
                    } else {
                        var message = (post.status == 1) ? 'Video Activated Successfully' : (post.status == 0) ? 'Video Deactivated Successfully' : 'Video Deleted Successfully'
                        response = general.response_format(true, message, {}, connection, post, "admin/video/changestatus", "Video status changed successfully");
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
router.post('/video/updatevideo',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'id', 'title','url','sequence'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        var id = post.id;
        var sequence = post.sequence
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/video/updatevideo", 'Datebase Connection error');
                res.send(response);
            } else{
                var checkid = "SELECT * FROM videos WHERE  status!='2' AND id = '" + id + "' "; 
                connection.query(checkid, function (err, idponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/updatevideo", 'Mysql error in check video by id query');
                        res.send(response);
                    } else {
                        if (idponse.length > 0) {
                            var checksequence = "SELECT * FROM videos WHERE video_order='"+sequence+"' AND  status!='2' AND id != '" + id + "' "; 
                            console.log(checksequence)
                            connection.query(checksequence, function (err, sequenceponse) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/updatevideo", 'Mysql error in check sequence query');
                                    res.send(response);
                                } else {
                                    if (sequenceponse.length > 0) {

                                        response = general.response_format(false, "Video sequence already set for another video", {}, connection, post, "admin/video/updatevideo", 'error- video sequence already exist');
                                        res.send(response);
                                    }else{
                                        var sql = "UPDATE videos SET video_title = ?,video_url = ?, video_order = ?,updated_date = ? WHERE id = ? ";
                                        var values = [post.title, post.url, post.sequence, created_date, id]
                                        connection.query(sql,values, function (err, rowsdata) {
                                            if (err) {
                                                console.log(err)
                                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/updatevideo", 'Mysql error in update user query');
                                                res.send(response);
                                            }  else {
                                                response = general.response_format(true, "Video updated successfully", {}, connection, post, "admin/video/updatevideo", "video  updated successfully");
                                                res.send(response);
                                            }
                                        })
                                    }
                                }
                            })
                           
                        } else {
                            response = general.response_format(false, 'Video record does not exist', {}, connection, post, "admin/video/updatevideo", 'video record not found error');
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
});

//api user for Add video 
router.post('/video/addvideo',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'title','url','sequence'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        
        var sequence = post.sequence
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/video/addvideo", 'Datebase Connection error');
                res.send(response);
            } else{
                var checksequence = "SELECT * FROM videos WHERE video_order='"+sequence+"' AND  status!='2'"; 
                console.log(checksequence)
                connection.query(checksequence, function (err, sequenceponse) {
                    if (err) {
                        console.log(err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/addvideo", 'Mysql error in check sequence query');
                        res.send(response);
                    } else {
                        if (sequenceponse.length > 0) {

                            response = general.response_format(false, "Video sequence already set for another video", {}, connection, post, "admin/video/addvideo", 'error-sequence already exist');
                            res.send(response);
                        }else{
                            var sql = `INSERT INTO videos (video_title,video_url,video_order,status,created_date) VALUES ?`;
                            var values = [
                                [
                                    [post.title,post.url,post.sequence,1,created_date]
                                ]
                            ];
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/video/addvideo", 'Mysql error in create video query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, 'Video created successfully', {}, connection, post, "admin/video/addvideo", "video created successfully");
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

module.exports = router;

