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


/*api for search student
Params: 
*/
router.post('/student/searchstudent', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

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
            var sort = " ORDER BY "+sort_by+sort_sequence;
        }
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                let search_query = "u.role_id=2 AND ((u.current_progress_status>=3 AND u.looking_for_job=1) OR (u.is_special_candidate=1 AND u.is_verified=1 AND u.looking_for_job=1 )) ";
                if(post.filtred && Object.keys(post.filtred).length > 0){
                    
                    if(post.filtred.career_path && post.filtred.career_path != ""){
                        search_query += ` AND (u.career_path_id IN (${post.filtred.career_path}))`;
                    }
                    if(post.filtred.location && post.filtred.location != ""){
                        search_query += ` AND (sd.currently_lived IN (${post.filtred.location}))`;
                    }
                    if(post.filtred.remortely && post.filtred.remortely != ""){
                        search_query += ` AND (sd.interested_remortely IN ( ${post.filtred.remortely}))`;
                    }
                    if(post.filtred.experience_level && post.filtred.experience_level != ""){
                        search_query += ` AND (sd.experience_level IN ( ${post.filtred.experience_level}))`;
                    }
                    if(post.filtred.skills && post.filtred.skills != ""){
                        let skillquery = " ";
                        var array11 = post.filtred.skills.split(',');
                        console.log("array1",array11[1])
                        for(var i=0;i<array11.length;i++){
                            console.log("array1222",i,array11[i])
                            if(i==0){
                                skillquery += ` FIND_IN_SET(${array11[i]},sd.skills)` 
                            }else{
                                skillquery += ` OR FIND_IN_SET(${array11[i]},sd.skills)` 
                            }
                            
                        }
                        search_query += ` AND (${skillquery} )`;
                    }
                }
                var searchqcount = `SELECT u.*,sd.skills as skills,ct.name as place,cp.career_name as career_name FROM user u
                LEFT JOIN student_details sd ON sd.user_id=u.id 
                LEFT JOIN career_path cp ON cp.id=u.career_path_id
                LEFT JOIN city ct ON ct.id=sd.currently_lived
                WHERE ${search_query}`;
                console.log("searchqcount",searchqcount)
                
                connection.query(searchqcount, function (err, searchqcount) {
                    if (err) {
                        console.log("err",err)
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                        res.send(response);
                    } else {
                        var totalrow = searchqcount.length;
                        var searchq = `SELECT u.*,sd.skills as skills,ct.name as place,cp.career_name as career_name FROM user u
                            LEFT JOIN student_details sd ON sd.user_id=u.id 
                            LEFT JOIN career_path cp ON cp.id=u.career_path_id
                            LEFT JOIN city ct ON ct.id=sd.currently_lived
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
                                        var candidatekey = key+1;
                                        var tempobj = {}
                                        tempobj.id = element.id
                                        tempobj.candidatename = "Candidate "+candidatekey
                                        tempobj.display_name = 0
                                        tempobj.career_path =element.career_name
                                        tempobj.place =(element.place)?element.place:''
                                        responsedata.push(tempobj)
                                    
                                        if(element.skills){
                                            var sql = `SELECT GROUP_CONCAT(skill_name SEPARATOR ',') as skill_name FROM skills WHERE id IN(${element.skills});`
                                            connection.query(sql, function (err, skilldata) {
                                                if (err) {
                                                    dataCB(err)
                                                } else {
                                                    var array11 = skilldata[0].skill_name.split(',',3);
                                                    var result = array11.join(', ')
                                                    tempobj.skill = result;
                                                    dataCB()
                                                }
                                            })
                                        }else{
                                            tempobj.skill = '';
                                            dataCB()
                                        }
                                    }, function (err) {
                                        if (err) {
                                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                                            res.send(response);
                                        } else {
                                            console.log("responsedata",responsedata)
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
router.post('/student/studentdetails', multerUpload.fields([{ 'name': 'profile_pic' }]), functions.verifyTokenFront, (req, res, next) => {

    let response = {};
    var post = req.body;
    console.log("#11", post);
    var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    var required_params = ['user_id','student_id'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0;
    if (valid) {
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
                res.send(response);
            } else {
                var sql = `SELECT u.*,cp.career_name as career_name FROM user u 
                LEFT JOIN career_path cp ON cp.id=u.career_path_id
                WHERE u.id=${post.student_id}`;
                connection.query(sql,(err,users)=>{
                    if(err){
                        console.log(err);
                        response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'Mysql error in check phone query');
                        res.send(response);
                    }else{
                        if(users.length > 0){
                            let temp_obj = users[0];
                            if(post.display_name && post.display_name == 1){
                                var candidatename=temp_obj['first_name']+' '+temp_obj['last_name']
                                var phonenumber =temp_obj['phone']
                            }else{
                                var candidatename=(post.display_name_text)?post.display_name_text:'Candidate '+temp_obj['id']
                                var phonenumber = ""
                            }
                            let user = {
                                user_id: temp_obj['id'],
                                full_name: candidatename,
                                phone : phonenumber,
                                career_path: (temp_obj['career_name'])?temp_obj['career_name']:'',
                                current_progress_status: (temp_obj['current_progress_status'])?temp_obj['current_progress_status']:0,
                                looking_for_job: (temp_obj['looking_for_job'])?temp_obj['looking_for_job']:0,
                                has_offer:'',
                                technical_assisment:'',
                                student_details: [],
                                student_work_history: [],
                                student_education: [],
                                student_attachment: [],
                            }
                            async.waterfall([
                                function(callback) {
                                    //detail data
                                    // (SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') from skills WHERE id IN(sd.skills)) as skillname 
                                    var checkdetails = `SELECT sd.*,ct.name as place                                   
                                    FROM student_details sd
                                    LEFT JOIN city ct ON ct.id=sd.currently_lived
                                    WHERE sd.user_id =${temp_obj['id']} ;`
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            var detailobj = {}
                                            
                                            if(checkdetailsdata.length> 0){
                                                detailobj.experience_level = (checkdetailsdata[0].experience_level)?constants.EXPERIENCE[checkdetailsdata[0].experience_level]:''
                                                detailobj.currently_lived = checkdetailsdata[0].place
                                                detailobj.employment_type = constants.EMPLOYMENT[checkdetailsdata[0].employment_type]
                                                detailobj.interested_remortely = (checkdetailsdata[0].interested_remortely == 0)?'No':'Yes'
                                                detailobj.willing_to_works = checkdetailsdata[0].willing_to_works
                                                detailobj.looking_for_role = checkdetailsdata[0].looking_for_role
                                            
                                                detailobj.bio = checkdetailsdata[0].bio
                                                detailobj.anything_else_details = checkdetailsdata[0].anything_else_details
                                                if(post.display_name && post.display_name == 1){
                                                    detailobj.resume = (checkdetailsdata[0].resume) ? checkdetailsdata[0].resume : ''
                                                    detailobj.resume_url = (checkdetailsdata[0].resume) ? constants.API_URL+'resume/'+checkdetailsdata[0].resume : ''
                                                    detailobj.github_url = checkdetailsdata[0].github_url ? checkdetailsdata[0].github_url : ''
                                                    detailobj.linkedin_url = checkdetailsdata[0].linkedin_url ? checkdetailsdata[0].linkedin_url : ''
                                                    detailobj.website_url = checkdetailsdata[0].website_url ? checkdetailsdata[0].website_url : ''
                                                }else{
                                                    detailobj.resume = ''
                                                    detailobj.resume_url = ''
                                                    detailobj.github_url = ''
                                                    detailobj.linkedin_url = ''
                                                    detailobj.website_url = ''
                                                }
                                                
                                                if(checkdetailsdata[0].skills){
                                                    var sql = `SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') as skill_name FROM skills WHERE id IN(${checkdetailsdata[0].skills});`
                                                    connection.query(sql, function (err, skilldata) {
                                                        if (err) {
                                                            dataCB(err)
                                                        } else {
                                                            // var array11 = skilldata[0].skill_name.split(',',3);
                                                            // var result = array11.join(', ')
                                                            detailobj.skills = skilldata[0].skill_name;
                                                            user.student_details = detailobj
                                                            callback(null);
                                                        }
                                                    })
                                                }else{
                                                    detailobj.skills = '';
                                                    user.student_details = detailobj
                                                    callback(null);
                                                }
                                            }else{
                                                detailobj.experience_level = ''
                                                detailobj.currently_lived = ''
                                                detailobj.employment_type = ''
                                                detailobj.interested_remortely = ''
                                                detailobj.willing_to_works = ''
                                                detailobj.looking_for_role = ''
                                            
                                                detailobj.bio = ''
                                                detailobj.anything_else_details = ''
                                                detailobj.resume = ''
                                                detailobj.resume_url = ''
                                                detailobj.github_url = ''
                                                detailobj.linkedin_url = ''
                                                detailobj.website_url = ''
                                                detailobj.skills = ''
                                                user.student_details = detailobj
                                                callback(null);
                                            }
                                            
                                            
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var gettechnicalskill = `SELECT GROUP_CONCAT(skill_name SEPARATOR ', ') as technicalskills from skills WHERE id IN(SELECT skill_id from student_skill where user_id=${temp_obj['id']} AND skill_exam_status=3) ;`
                                    console.log("gettechnicalskill",gettechnicalskill)
                                    connection.query(gettechnicalskill, function (err, gettechnicalskilldata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.technical_assisment = gettechnicalskilldata[0].technicalskills
                                            callback(null);   
                                        }
                                    })

                                },           
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT *,DATE_FORMAT(start_date, '%m/%d/%Y') as start_date,DATE_FORMAT(end_date, '%m/%d/%Y') as end_date FROM student_work_history WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_work_history = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT *,DATE_FORMAT(start_date, '%m/%d/%Y') as start_date,DATE_FORMAT(end_date, '%m/%d/%Y') as end_date FROM student_education WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.student_education = checkdetailsdata
                                            callback(null);
                                        }
                                    })
                                },
                                function(callback) {
                                    //detail data
                                    if(post.display_name && post.display_name == 1){
                                        var checkdetails = `SELECT * FROM student_attachment WHERE user_id=${temp_obj['id']} ORDER BY id ASC `;
                                        connection.query(checkdetails, function (err, checkdetailsdata) {
                                            if (err) {
                                                callback(null);
                                            } else {
                                                checkdetailsdata = checkdetailsdata.map((item) => {
                                                    return {
                                                        id: item.id,
                                                        user_id: item.user_id,
                                                        certification: item['certification'] ? item['certification'] : '',
                                                        certification_url: (item['certification'])?constants.API_URL+'certification/'+item['certification']: ''
                                                    };
                                                });
                                                user.student_attachment = checkdetailsdata
                                                callback(null);
                                            }
                                        })
                                    }else{
                                        callback(null);
                                    }                                    
                                },
                                function(callback) {
                                    //detail data
                                    var checkdetails = "SELECT * FROM watchlist_student WHERE student_id = '" + post.student_id + "' AND status=9 ORDER BY id ASC ";
                                    connection.query(checkdetails, function (err, checkdetailsdata) {
                                        if (err) {
                                            callback(null);
                                        } else {
                                            user.has_offer = (checkdetailsdata.length>0)?'Yes':'No' 
                                            callback(null);
                                        }
                                    })
                                }
                            ],(err,result)=>{
                                console.log("responsedata",user)
                                response = general.response_format(true, messages.SUCCESS, user, connection, post, "userskill/listuserskill", "skill Data Fetched Successfully");
                                res.send(response);
                            })
                                            
                            
                        }else{
                            response = general.response_format(false, messages.OOPS, {}, connection, post, "front/student/updateprofile", 'error student not found');
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

module.exports = router;

