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
/*
*Get country and states data
*/
router.post('/master/get-master', multerUpload.fields([{ 'name': 'profile_pic' }]), function (req, res, next) {
    var post = req.body;
    response = {};
    if (typeof (post.type) != 'undefined' && post.type) {
        var where = "status = 1 ";
        if (typeof (post.id) != 'undefined' && post.id > 0) {
            var id_name = "id";
            if (post.type == "states") {
                var id_name = "country_id";
            }
            where = where + "AND " + id_name + "='" + post.id + "' ";
        }
        var sort = "";
        if (post.type == "city") {
            sort = "ORDER BY name ASC";
        }
        req.getConnection(function (err, connection) {
            if (err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            }else{
                connection.query("SELECT * FROM " + post.type + " WHERE " + where + " " + sort + " ", function (err, rows) {
                    if (err) {
                        console.log("Error %s", err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/master/get-master", "Proble in select query");
                        res.send(response);
                    } else {
                        var data = [];
                        if (rows.length > 0) {
                            rows.forEach(function (row) {
                                result = {}
                                result.id = row.id;
                                result.name = row.name;
                                data.push(result);
                            });
                        }
                        response = general.response_format(true, 'Success', data,connection,post,"front/master/get-master",'Success');
                        res.send(response);
                    }
                });
            }
              
            
        });
    } else {
        response = general.response_format(false, messages.WRONG_MISSING_PARAM, {});
        console.log("#test",response);
        
        res.send(response);
    }
});



router.post('/master/get-cms', upload.array(), function (req, res, next) {
    var post = req.body; 
    response = {}; 
    var required_params = ['type']; 
    var elem = functions.validateReqParam(post, required_params); 
    var valid = elem.missing.length == 0 && elem.blank.length == 0; 
    if (valid) { 
        req.getConnection(function (err, connection) { 
            if (err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            }else{
                connection.query("SELECT * FROM cms_management WHERE status=1 and type='" + post.type + "'", function (err, rows) { 
                    if (err) { 
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/master/get-cms", "Proble in select query");
                        res.send(response);
                    } else { 
                        var result = {}; 
                        if (rows.length > 0) { 
                            result.id = rows[0]['id']; 
                            result.title = rows[0]['title']; 
                            result.content = (rows[0]['content'] != '' && rows[0]['content'] != null) ? '<html>' + rows[0]['content'] + '</html>' : ''; 
                          

                            response = general.response_format(true, 'Success', result,connection,post,"front/master/get-sms",'Success');
                            res.send(response);
                        } else { 
                            response = general.response_format(true, 'Success', {},connection,post,"front/master/get-sms",'Success');
                            res.send(response);
                        } 
                    } 
                }); 
            }
            
        }); 
    } else { 
        var str = functions.loadErrorTemplate(elem);
        console.log("#test",str);
        response = general.response_format(false, messages.WRONG_MISSING_PARAM + str, {});
        console.log("#test",response);
        
        res.send(response);
    } 
});

router.get('/master/get-career-path',(req,res)=>{
    req.getConnection((err,connection)=>{
        if(err){
            response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
            res.send(response);
        }else{
            connection.query(`SELECT * FROM career_path WHERE status = 1`,(err,career_paths)=>{
                if(err){
                    response = general.response_format(false, messages.OOPS, {}, connection, {}, "front/master/get-career-path", "Proble in select query");
                    res.send(response);
                }else{
                    if(career_paths.length > 0){
                        response = general.response_format(true, 'Success', career_paths,connection,{},"front/master/get-career-path",'Success');
                        res.send(response);
                    }else{
                        response = general.response_format(true, 'Success', [],connection,{},"front/master/get-career-path",'Success');
                        res.send(response);
                    }
                }
            })
        }
    })
})

router.post('/master/get-skills',(req,res)=>{
    req.getConnection((err,connection)=>{
        if(err){
            response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
            res.send(response);
        }else{
            connection.query(`SELECT * FROM skills WHERE status = 1 and is_default_skill = 0 GROUP BY skill_name ORDER BY skill_name ASC`,(err,career_paths)=>{
                if(err){
                    response = general.response_format(false, messages.OOPS, {}, connection, {}, "front/master/get-career-path", "Proble in select query");
                    res.send(response);
                }else{
                    if(career_paths.length > 0){
                        response = general.response_format(true, 'Success', career_paths,connection,{},"front/master/get-career-path",'Success');
                        res.send(response);
                    }else{
                        response = general.response_format(true, 'Success', [],connection,{},"front/master/get-career-path",'Success');
                        res.send(response);
                    }
                }
            })
        }
    })
})

/*
API for get admin timeslot
*/
router.post('/master/get-admin-timeslot', upload.array(),(req,res)=>{
    req.getConnection((err,connection)=>{
        if(err){
            response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
            res.send(response);
        }else{
            connection.query(`SELECT * FROM admin_timeslot`,(err,admin_timeslot)=>{
                if(err){
                    response = general.response_format(false, messages.OOPS, {}, connection, {}, "front/master/get-career-path", "Proble in select query");
                    res.send(response);
                }else{
                    if(admin_timeslot.length > 0){
                        response = general.response_format(true, 'Success', admin_timeslot,connection,{},"front/master/get-career-path",'Success');
                        res.send(response);
                    }else{
                        response = general.response_format(true, 'Success', [],connection,{},"front/master/get-career-path",'Success');
                        res.send(response);
                    }
                }
            })
        }
    })
})
module.exports = router;

