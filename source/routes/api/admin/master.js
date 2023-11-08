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

