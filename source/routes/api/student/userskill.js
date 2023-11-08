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
var fs = require('fs');
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
API for add user new skill
Request Param: user_id,skill_id
*/
router.post('/userskill/addnewskill',  multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['user_id', 'skill_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "userskill/addnewskill", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkid = `SELECT * FROM student_skill WHERE  user_id =${post.user_id} AND skill_id = ${post.skill_id};`; 
                console.log(checkid)
                connection.query(checkid, function (err, idponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/addnewskillr", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if (idponse.length > 0) {
                            //error skill alreaded added
                            response = general.response_format(false, "The Skill which you want to add in your profile is already added", {}, connection, post, "userskill/addnewskill", 'Mysql error in check skill query');
                            res.send(response);
                        }else{
                            console.log('ddddd')
                            //add new skill into table
                            var sql = `INSERT INTO student_skill (user_id,skill_id,is_default_skill,skill_exam_status,created_date) VALUES ?`;
                            var values = [
                                [
                                    [post.user_id,post.skill_id,0,0,created_date]
                                ]
                            ];
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/addnewskill", 'Mysql error in inser skill query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, 'Skill Added Successfully', {}, connection, post, "auserskill/addnewskill", "skill created successfully");
                                    res.send(response);
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

/*
API for  user skill list
Request Param: user_id
*/
router.post('/userskill/listuserskill',  multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['user_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (valid) {
      
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "userskill/listuserskill", 'Datebase Connection error');
                res.send(response);
            } else {
                
                var count_sql = `SELECT COUNT(*) AS total FROM student_skill WHERE user_id = ${post.user_id}`;
                connection.query(count_sql, function (err, rows) {
                console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/listuserskill", "Proble in select query");
                        res.send(response);
                    } else {
                        var lastrefresh = ''
                        fs.readFile('crondata.txt', 'utf-8', function(err, cronfiledata) {
                            if (err) throw err;
                            console.log("cronfiledata",cronfiledata)
                            lastrefresh = cronfiledata
                            var sql = `SELECT s.id as skill_id,s.career_path_id,s.skill_name,s.skill_url,s.skill_key,
                            ss.is_default_skill,ss.skill_exam_status,ss.id as student_skill_id
                            FROM student_skill ss
                            LEFT JOIN skills s ON s.id = ss.skill_id
                            WHERE ss.user_id = ${post.user_id}
                            ORDER BY ss.id ASC`;
                            console.log(sql)
                            connection.query(sql, function (err, result) {
                                if (err) {
                                    console.log("err2222",err);
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/listuserskill", "Proble in select query with pagination");
                                    res.send(response);
                                } else {
                                    var data = {
                                        total: (rows.length > 0) ? rows[0].total : 0,
                                        data: (result.length > 0) ? result : [],
                                        lastrefresh: lastrefresh
                                    };
                                    response = general.response_format(true, messages.SUCCESS, data, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                    res.send(response);
                                }
                            });
                           
                        })
                        
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

/*
API for career path skill list
Request Param: user_id,career_path_id
*/
router.post('/userskill/list_careerpath_skill',  multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['user_id','career_path_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (valid) {
      
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "userskill/list_careerpath_skill", 'Datebase Connection error');
                res.send(response);
            } else {
                
                var count_sql = `SELECT COUNT(*) AS total FROM skills WHERE skill_key !="" AND skill_url != "" AND career_path_id = ${post.career_path_id}`;
                connection.query(count_sql, function (err, rows) {
                console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/list_careerpath_skill", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT *
                        FROM skills
                        WHERE skill_key !="" AND skill_url != "" AND career_path_id = ${post.career_path_id}
                        ORDER BY skill_name ASC`;
                        console.log(sql)
                        connection.query(sql, function (err, result) {
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/list_careerpath_skill", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "userskill/list_careerpath_skill", "careeer path skill Data Fetched Successfully");
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

})

/*
API for change user skill status
Request Param: user_id,skill_id,status
status = 0=not given exm, 1= start given exam, 2=fail, 3=pass
*/
router.post('/userskill/changeskillstatus',  multerUpload.fields([{ 'name': 'profile_pic' }]),functions.verifyTokenFront, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['user_id', 'skill_id','status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if (valid) {
        var id = post.id;
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "userskill/changeskillstatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var checkid = `SELECT * FROM student_skill WHERE  user_id =${post.user_id} AND skill_id = ${post.skill_id};`; 
                console.log(checkid)
                connection.query(checkid, function (err, idponse) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/changeskillstatusr", 'Mysql error in check skill query');
                        res.send(response);
                    } else {
                        if (idponse.length > 0) {
                            var sql = `UPDATE student_skill SET skill_exam_status  = ${post.status},updated_date = '${created_date}' WHERE user_id =${post.user_id} AND skill_id = ${post.skill_id};`;
                            connection.query(sql, function (err, rowsdata) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/changeskillstatus", 'Mysql error in update skill query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, "Success", {}, connection, post, "userskill/changeskillstatus", "status updated successfully");
                                    res.send(response);
                                }
                            })

                        }else{
                            console.log('ddddd')
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "userskill/changeskillstatus", 'Mysql error in check skill not found');
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



module.exports = router;

