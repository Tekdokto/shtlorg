var express = require('express');
var router = express.Router();
var hash = require('../../../pass').hash;
var path = require('path');
var multer = require('multer');
var msg = require('../../../config/messages');
var func = require('../../../config/functions');
var functions = func.func();
var messages = msg.messages;
var generalfunction = require('../../../services/general');
var general = generalfunction.func();
const constants = require('../../../config/constants');
var moment = require('moment');
var lodash = require('lodash');
var async = require('async');
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


//API for get all category listing
router.post('/category/getcategory', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage")
    var post = req.body;
    var required_params = ['admin_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    let pageSize = (post.page_size && post.page_size > 0)?post.page_size:constants.ITEMS_PER_PAGE;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/getcategory", 'Datebase Connection error');
                res.send(response);
            } else {
                var offset = 0, where_cond = "", order_sql = " ORDER BY id DESC";
                var page = post.page;
                var limit =  post.page_size;
                limit = ((page*post.page_size))+','+(post.page_size)
                let search_query = "";
                var sort = "ORDER BY id DESC";
        
                if(post.sort_param){
                    var sort_by = post.sort_param;
                    var sort_sequence = (post.order == 1)?" ASC":" DESC";
                    sort = " ORDER BY "+sort_by+sort_sequence;
                }
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND id = ${post.id}`;
                }
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.career_name && post.filtred.career_name != ""){
                     
                        search_query += ` AND (career_name like '%${post.filtred.career_name}%')`;
                    }
                   
                }
                if (post.page && post.page !== null) {
                    offset = post.page * pageSize;
                }
                var count_sql = `SELECT COUNT(*) AS total FROM career_path WHERE status != ?  ${search_query} ${sort}`;
                connection.query(count_sql, [2], function (err, rows) {
                    if (err) {
                        console.log("err2 : ",err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getcategory", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT * FROM career_path WHERE status != ? ${search_query} ${sort} LIMIT ${limit}`;
                        console.log(sql)
                        connection.query(sql, [2], function (err, result) {
                            if (err) {
                                console.log("err1 : ",err);
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getcategory", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/user/getcategory", "category Data Fetched Successfully");
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

router.post('/category/getallcategory',upload.array(),function(req,res){
    let post = req.body;
    req.getConnection(function (err, connection) {
        if (err) {
            response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/getcategory", 'Datebase Connection error');
            res.send(response);
        } else {
            var sql = `SELECT * FROM category WHERE status != ?`;                    
            connection.query(sql, [2], function (err, result) {
                if (err) {
                    console.log("err1 : ",err);
                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getcategory", "Proble in select query with pagination");
                    res.send(response);
                } else {
                    var data = {
                        data: (result.length > 0) ? result : []
                    };
                    response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/user/getcategory", "category Data Fetched Successfully");
                    res.send(response);
                }
            });               
        }
    });
})
//API for change category status
router.post('/category/changestatus', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/category/changestatus", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE career_path SET status = ? WHERE id = ?";
                connection.query(sql, [post.status, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/changestatus", 'Error in update query');
                        res.send(response);
                    } else {
                        if(post.status == 2){
                            var delete_skill_for_career_sql = "UPDATE skills SET status = ? WHERE career_path_id = ?";
                            connection.query(delete_skill_for_career_sql, [post.status, post.id], function (err, updateskills) {
                                var message = (post.status == 1) ? 'Career Path Activated Successfully' : (post.status == 0) ? 'Career Path Deactivated Successfully' : 'Career Path Deleted Successfully'
                                response = general.response_format(true, message, {}, connection, post, "admin/category/changestatus", "Career Path status changed successfully");
                                res.send(response);
                            })
                        }else{
                        var message = (post.status == 1) ? 'Career Path Activated Successfully' : (post.status == 0) ? 'Career Path Deactivated Successfully' : 'Career Path Deleted Successfully'
                        response = general.response_format(true, message, {}, connection, post, "admin/category/changestatus", "Career Path status changed successfully");
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
//api user for update category 
router.post('/category/updatecategory',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'id', 'category_name'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    console.log("post",post)
    if(valid){
        var id = post.id;
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/category/updatecategory", 'Datebase Connection error');
                res.send(response);
            } else{
                var carrername = post.category_name
                var checktitle = "SELECT * FROM career_path WHERE (career_name = '" + carrername.trim() + "') AND status!='2' AND id != '" + post.id + "'"; 
                connection.query(checktitle, function (err, checktitle) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        if(checktitle.length > 0){
                            response = general.response_format(false, 'Career Path already exist', {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                            res.send(response);
                        }else{
                            var sql = "UPDATE career_path SET career_name = ? WHERE id = ? ";
                            var values = [post.category_name, id]
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/updatecategory", 'Mysql error in update category query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, messages.CATEGORY_UPDATED, {}, connection, post, "admin/category/updatecategory", "category updated successfully");
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

//api user for Add category 
router.post('/category/addcategory',multerUpload.single('profile_picture'),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'category_name'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        
        
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/category/addcategory", 'Datebase Connection error');
                res.send(response);
            } else{
                var carrername = post.category_name
                var checktitle = "SELECT * FROM career_path WHERE (career_name = '" + carrername.trim() + "') AND status!='2'"; 
                console.log("checktitle1",checktitle)
                connection.query(checktitle, function (err, checktitle) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        console.log("checktitle",checktitle)
                        if(checktitle.length > 0){
                            response = general.response_format(false, 'Career Path already exist', {}, connection, post, "admin/user/adduser", 'Mysql error in check phone query');
                            res.send(response);
                        }else{

                            var sql = `INSERT INTO career_path (career_name,created_date) VALUES ?`;
                            var values = [
                                [
                                    [post.category_name,created_date]
                                ]
                            ];
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    console.log(err)
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/addcategory", 'Mysql error in create category query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, messages.CATEGORY_CREATED, {}, connection, post, "admin/category/addcategory", "category created successfully");
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


//API for get all sub category listing
router.post('/category/getsubcategory', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    console.log("innerpage")
    var post = req.body;
    var required_params = ['admin_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/user/getsubcategory", 'Datebase Connection error');
                res.send(response);
            } else {
                var page = post.page;
                var limit =  post.page_size;
                limit = ((page*post.page_size))+','+(post.page_size)
                let search_query = "";
                var sort = "ORDER BY s.id DESC";
                if (post.id && post.id !== null && post.id !== "null") {
                    search_query += ` AND s.id = ${post.id}`;
                }
                if(post.sort_param){
                    var sort_by = post.sort_param;
                    var sort_sequence = (post.order == 1)?" ASC":" DESC";
                    if(sort_by == 'skill_name'){
                        var sort = " ORDER BY s.skill_name "+sort_sequence;
                    }else if(sort_by == 'career_name'){
                        var sort = " ORDER BY c.career_name"+sort_sequence;
                    }else if(sort_by == 'skill_key'){
                        var sort = " ORDER BY s.skill_key"+sort_sequence;
                    }else{
                        var sort = " ORDER BY "+sort_by+sort_sequence;
                    }
                }
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    if(post.filtred.skill_name && post.filtred.skill_name != ""){
                     
                        search_query += ` AND (s.skill_name like '%${post.filtred.skill_name}%')`;
                    }
                    if(post.filtred.career_name && post.filtred.career_name != ""){
                     
                        search_query += ` AND (c.career_name like '%${post.filtred.career_name}%')`;
                    }
                    if(post.filtred.skill_key && post.filtred.skill_key != ""){
                     
                        search_query += ` AND (s.skill_key like '%${post.filtred.skill_key}%')`;
                    }
                   
                }
                var count_sql = `SELECT COUNT(*) AS total FROM skills s 
                LEFT JOIN career_path c ON c.id = s.career_path_id  
                WHERE s.status != ? ${search_query} ${sort}`;
                connection.query(count_sql, [2], function (err, rows) {
                    if (err) {
                        console.log('err11',err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getsubcategory", "Proble in select query");
                        res.send(response);
                    } else {
                        var sql = `SELECT s.id,s.career_path_id,c.career_name,s.skill_name,s.skill_url,s.skill_key,s.is_default_skill,s.status,s.created_date FROM skills s 
                        LEFT JOIN career_path c ON c.id = s.career_path_id 
                        WHERE s.status != ? ${search_query} ${sort} LIMIT ${limit}`;
                        
                        connection.query(sql, [2], function (err, result) {
                            if (err) {
                                console.log('err2',err)
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/user/getsubcategory", "Proble in select query with pagination");
                                res.send(response);
                            } else {
                                var data = {
                                    total: (rows.length > 0) ? rows[0].total : 0,
                                    data: (result.length > 0) ? result : []
                                };
                                response = general.response_format(true, messages.SUCCESS, data, connection, post, "admin/user/getsubcategory", "sub category Data Fetched Successfully");
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
//API for change sub category status
router.post('/category/changestatussubcategory', upload.array(),functions.verifyTokenAdmin, function (req, res) {
    var post = req.body;
    console.log(post)
    var required_params = ['admin_id', 'id', 'status'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/category/changestatussubcategory", 'Datebase Connection error');
                res.send(response);
            } else {
                var sql = "UPDATE skills SET status = ? WHERE id = ?";
                connection.query(sql, [post.status, post.id], function (err, updateres) {
                    if (err) {
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/changestatussubcategory", 'Error in update query');
                        res.send(response);
                    } else {
                        var message = (post.status == 1) ? 'Skill Activated Successfully' : (post.status == 0) ? 'Skill Deactivated Successfully' : 'Skill Deleted Successfully'
                        response = general.response_format(true, message, {}, connection, post, "admin/category/changestatussubcategory", "SubCategory status changed successfully");
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
//api user for update sub category 
router.post('/category/updatesubcategory',upload.array(),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params = ['admin_id', 'id', 'skill_name'  , 'career_path_id' ,'is_default_skill'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    
    if(valid){
        var id = post.id;
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/category/updatesubcategory", 'Datebase Connection error');
                res.send(response);
            } else{
                async.waterfall([
                    function(callback) {
                        if(post.skill_key && post.skill_key!=""){
                            //check skill already exist or not
                            var checkexist = "SELECT * FROM skills WHERE skill_key = '" + post.skill_key.trim() + "'  AND status!='2' AND career_path_id = '" + post.career_path_id + "' AND id != '" + id + "' "; 
                            connection.query(checkexist, function (err, checkexistresp) {
                                if (err) {
                                    
                                    callback(messages.OOPS);
                                } else {
                                    if (checkexistresp.length > 0) {
                                        callback("Exam id already exist with another skill");

                                    }else{
                                        callback(null);
                                    }
                                }
                            })

                        }else{
                            callback(null);
                        }

                    },
                    function(callback) {
                        if(post.skill_url && post.skill_url!=""){
                            //check skill already exist or not
                            var checkexist = "SELECT * FROM skills WHERE skill_url = '" + post.skill_url.trim() + "'  AND status!='2' AND career_path_id = '" + post.career_path_id + "' AND id != '" + id + "' "; 
                            connection.query(checkexist, function (err, checkexistresp) {
                                if (err) {
                                    
                                    callback(messages.OOPS);
                                } else {
                                    if (checkexistresp.length > 0) {
                                        callback("Exam URL already exist with another skill");

                                    }else{
                                        callback(null);
                                    }
                                }
                            })

                        }else{
                            callback(null);
                        }

                    }
                ],(err,result)=>{
                   if(err){
                    response = general.response_format(false, err, {}, connection, post, "admin/category/updatesubcategory", 'Mysql error in check already exist skill id and url');
                    res.send(response);
                   }else{
                    var update_default_set_skill = `UPDATE skills SET is_default_skill=0 WHERE career_path_id='${post.career_path_id}' AND is_default_skill = 1 AND status=1 AND 1 = ${post.is_default_skill}`;
                    // console.log("update quesry:",update_default_set_skill)
                    connection.query(update_default_set_skill,(err,skills)=>{
                        if(err){
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/updatesubcategory", 'Mysql error in update sub category query');
                            res.send(response);
                        }else{                                           
                            var sql = "UPDATE skills SET skill_name = ? , skill_url = ? ,skill_key = ? , career_path_id = ? ,is_default_skill = ? WHERE id = ? ";
                            var values = [post.skill_name, post.skill_url, post.skill_key, post.career_path_id,post.is_default_skill, id]
                            connection.query(sql,values, function (err, rowsdata) {
                                if (err) {
                                    response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/updatesubcategory", 'Mysql error in update sub category query');
                                    res.send(response);
                                }  else {
                                    response = general.response_format(true, messages.SUBCATEGORY_UPDATED, {}, connection, post, "admin/category/updatesubcategory", "sub category updated successfully");
                                    res.send(response);
                                }
                            })
                            
                        }
                    })
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

//api user for Add sub category 
router.post('/category/addsubcategory',upload.array(),functions.verifyTokenAdmin,function(req,res){
    var post = req.body;
    var required_params =['admin_id', 'skill_name'  , 'career_path_id' ,'is_default_skill'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    if(valid){
        
        
        req.getConnection(function(err,connection){
            if(err){
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {}, connection, post, "admin/category/addsubcategory", 'Datebase Connection error');
                res.send(response);
            } else{
                async.waterfall([
                    function(callback) {
                        if(post.skill_key && post.skill_key!=""){
                            //check skill already exist or not
                            var checkexist = "SELECT * FROM skills WHERE skill_key = '" + post.skill_key.trim() + "'  AND status!='2' AND career_path_id = '" + post.career_path_id + "'"; 
                            connection.query(checkexist, function (err, checkexistresp) {
                                if (err) {
                                    
                                    callback(messages.OOPS);
                                } else {
                                    if (checkexistresp.length > 0) {
                                        callback("Exam id already exist with another skill");

                                    }else{
                                        callback(null);
                                    }
                                }
                            })

                        }else{
                            callback(null);
                        }

                    },
                    function(callback) {
                        if(post.skill_url && post.skill_url!=""){
                            //check skill already exist or not
                            var checkexist = "SELECT * FROM skills WHERE skill_url = '" + post.skill_url.trim() + "'  AND status!='2' AND career_path_id = '" + post.career_path_id + "'"; 
                            connection.query(checkexist, function (err, checkexistresp) {
                                if (err) {
                                    
                                    callback(messages.OOPS);
                                } else {
                                    if (checkexistresp.length > 0) {
                                        callback("Exam URL already exist with another skill");

                                    }else{
                                        callback(null);
                                    }
                                }
                            })

                        }else{
                            callback(null);
                        }

                    }
                ],(err,result)=>{
                   if(err){
                    response = general.response_format(false, err, {}, connection, post, "admin/category/updatesubcategory", 'Mysql error in check already exist skill id and url');
                    res.send(response);
                   }else{
                         var update_default_set_skill = `UPDATE skills SET is_default_skill=0 WHERE career_path_id='${post.career_path_id}' AND is_default_skill = 1 AND status=1 AND 1 = ${post.is_default_skill}`;
                        // console.log("update quesry:",update_default_set_skill)
                        connection.query(update_default_set_skill,(err,skills)=>{
                            if(err){
                                response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/updatesubcategory", 'Mysql error in update sub category query');
                                res.send(response);
                            }else{
                                console.log("Skills:",skills,post.career_path_id)                     
                                var sql = `INSERT INTO skills (skill_name, skill_url,skill_key, career_path_id,is_default_skill,created_date) VALUES ?`;
                                var values = [
                                    [
                                        [post.skill_name,post.skill_url,post.skill_key,post.career_path_id,post.is_default_skill,created_date]
                                    ]
                                ];
                                connection.query(sql,values, function (err, rowsdata) {
                                    if (err) {
                                        console.log(err)
                                        response = general.response_format(false, messages.OOPS, {}, connection, post, "admin/category/addsubcategory", 'Mysql error in create sub category query');
                                        res.send(response);
                                    }  else {
                                        response = general.response_format(true, messages.SUBCATEGORY_CREATED, {}, connection, post, "admin/category/addsubcategory", "sub category created successfully");
                                        res.send(response);
                                    }
                                })                    
                            }
                        })
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

