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


//functions.verifyTokenAdmin,
router.post('/cms/getcms', upload.array(),functions.verifyTokenAdmin, function (req, res) {
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
        var sort = "ORDER BY id DESC";

        if(post.sort_param){
            var sort_by = post.sort_param;
            var sort_sequence = (post.order == 1)?" ASC":" DESC";
            var sort = " ORDER BY "+sort_by+sort_sequence;
        }
        if(post.filtred && Object.keys(post.filtred).length > 0){
            if(post.filtred.title && post.filtred.title != ""){
             
                search_query += ` AND (title like '%${post.filtred.title}%')`;
            }
            if(post.filtred.content && post.filtred.content != ""){
               
                search_query += ` AND (content like '%${post.filtred.content}%')`;
            }
        }
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/cms/getcms", 'Datebase Connection error');
                res.send(response);
            } else {
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND id = ${post.id}`;
                }
                var count_sql = `SELECT COUNT(*) AS total FROM cms_management WHERE status != ?  ${search_query} ${sort}`;
                connection.query(count_sql, [2,2], function (err, rows) {
                   console.log(this.sql)
                    if (err) {
                        console.log("err111",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/cms/getcms", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT * FROM cms_management WHERE status != ? ${search_query} ${sort} LIMIT ${limit}`;
                        
                        connection.query(sql, [2,2], function (err, result) {
                            if (err) {
                                console.log("err2222",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/cms/getcms", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/cms/getcms", "User Data Fetched Successfully");
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

//api for update user data
router.post('/cms/updatecms', upload.array(),functions.verifyTokenAdmin, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#", post);
   
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['admin_id','title','content','id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var sql = "UPDATE cms_management SET title = ?,content = ? WHERE id = "+post.id;
                var values = [post.title,post.content]
                connection.query(sql,values, function (err, response) {
                    if (err) {
                        console.log(err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/updatecms", 'Mysql error in update query');
                        res.send(response);
                    } else {
                        response = general.response_format(true, "Content updated successfully", {},connection,post,"admin/user/updatecms",'cms update success');
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



module.exports = router;

