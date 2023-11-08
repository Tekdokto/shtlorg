var fs = require('fs');
var async = require('async');
var constants = require('../config/constants');
exports.func = function () {
    return {
        
        /*
         * get image path for api
         */
        image_not_found_api : function (dir, img, host) {

            img_path = "";
            if (img != '') {
                check_img_path = fs.realpathSync('.') + "/uploads/" + dir + "/" + img;
                var exists = fs.existsSync(check_img_path);
                if (exists) {
                    img_path = "http://" + host + "/" + dir + "/" + img;
                }
            }
            return img_path;
        },
        /*
         * get image path for backend
         */
        image_not_found : function (dir, user_id,img) {
            img_path = "/images/no_image/no_image.jpg";
            if (img != '') {
                check_img_path = fs.realpathSync('.') + "/uploads/user_"+user_id+"/" + dir + "/" + img;
                var exists = fs.existsSync(check_img_path);
                if (exists) {
                    img_path = "/user_"+user_id+"/" + dir + "/" + img;
                }
            }
            return img_path;
        },
        response_format: function (status, message, data,connection,postdata,apiname,errorkey) {
           // console.log("connection",connection)
            var response = {};
            response.status = status;
            if (status) {
                response.message = message;
                response.data = data;
                response.errors = {};
            }
            else {
                response.message = message;
                response.errors = { code: 404, message: response.message };
                response.data = {};
            }
            response.meta ={ api_version: 1};
            if(constants.DEBUG_ERROR){
                if(connection && connection != undefined){
                    var sql = "INSERT INTO debug_log (api_name, post_data,response_data,error_key) VALUES ?";
                    var values = [
                        [apiname, JSON.stringify(postdata), JSON.stringify(response),errorkey]
                    ];
                    connection.query(sql, [values], function (err, debugerror) {
                    
                    })
                }
            }
            return response;
        },
        get_user_structure_data: function(req,user,done){
            req.getConnection((err,connection)=>{
                if(err){
                    return done({ status : 0 , message : 'Unable to fetch userdata.Try Again!' })
                }else{
                    var sql = `SELECT u.*,c.career_name FROM user u
                    LEFT JOIN career_path c ON c.id=u.career_path_id WHERE u.id=${user.user_id}`;
                    connection.query(sql,(err,users)=>{
                        if(err){
                            return done({ status : 0 , message : 'Unable to fetch userdata.Try Again!' })
                        }else{
                            if(users.length > 0){
                                let temp_obj = users[0];
                                var fullname = '';
                                if(temp_obj['first_name']){
                                    fullname += temp_obj['first_name'];
                                }
                                if(temp_obj['last_name']) {
                                    fullname += ' '+temp_obj['last_name'];
                                }
                                let user = {
                                    user_id: temp_obj['id'],
                                    full_name: fullname,
                                    first_name: (temp_obj['first_name'])?temp_obj['first_name']:'',
                                    last_name: (temp_obj['last_name'])?temp_obj['last_name']:'',
                                    email: (temp_obj['email'])?temp_obj['email']:'',
                                    phone: (temp_obj['phone'])?temp_obj['phone']:'',
                                    profile_pic: (temp_obj['profile_pic'])?constants.API_URL+'profile_pic/'+temp_obj['profile_pic']:'',
                                    role_id: (temp_obj['role_id'])?temp_obj['role_id']:'',
                                    address: (temp_obj['address'])?temp_obj['address']:'',
                                    city: (temp_obj['city'])?temp_obj['city']:'',
                                    state: (temp_obj['state'])?temp_obj['state']:'',
                                    zipcode: (temp_obj['zipcode'])?temp_obj['zipcode']:'',
                                    is_password_changed: (temp_obj['is_password_changed'])?temp_obj['is_password_changed']:0,
                                    career_path_id: (temp_obj['career_path_id'])?temp_obj['career_path_id']:0,
                                    racial_identity: (temp_obj['racial_identity'])?temp_obj['racial_identity']:0,
                                    career_name:(temp_obj['career_name'])?temp_obj['career_name']:'',
                                    current_progress_status: (temp_obj['current_progress_status'])?temp_obj['current_progress_status']:0,
                                    looking_for_job: (temp_obj['looking_for_job'])?temp_obj['looking_for_job']:0,
                                    is_spec_sheet_added:(temp_obj['is_spec_sheet_added'])?temp_obj['is_spec_sheet_added']:0,
                                    created_date:(temp_obj['created_date'])?temp_obj['created_date']:'',
                                    student_details: [],
                                    student_work_history: [],
                                    student_education: [],
                                    student_attachment: [],
                                }
                                async.waterfall([
                                    function(callback) {
                                        //detail data
                                        var checkdetails = "SELECT * FROM student_details WHERE user_id = '" + temp_obj['id'] + "' ";
                                        connection.query(checkdetails, function (err, checkdetailsdata) {
                                            if (err) {
                                                callback(null);
                                            } else {
                                                user.student_details = checkdetailsdata
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
                                        var checkdetails = "SELECT * FROM student_attachment WHERE user_id = '" + temp_obj['id'] + "' ORDER BY id ASC ";
                                        connection.query(checkdetails, function (err, checkdetailsdata) {
                                            if (err) {
                                                callback(null);
                                            } else {
                                                user.student_attachment = checkdetailsdata
                                                callback(null);
                                            }
                                        })
                                    }
                                ],(err,result)=>{
                                    return done({status : 1,data:user}) 
                                })
                                                
                                
                            }else{
                                return done({ status : 0 , message : 'Unable to fetch userdata.Try Again!' })
                            }
                        }
                    })
                }
            })
        }
        ,
        get_user_structure_data_company: function(req,user,done){
            req.getConnection((err,connection)=>{
                if(err){
                    return done({ status : 0 , message : 'Unable to fetch userdata.Try Again!' })
                }else{
                    var sql = `SELECT u.*,c.company_name,c.company_email,c.company_website FROM user u
                    LEFT JOIN company c ON c.id = u.company_id
                    WHERE u.id=${user.user_id};`;
                    connection.query(sql,(err,users)=>{
                        if(err){
                            return done({ status : 0 , message : 'Unable to fetch userdata.Try Again!' })
                        }else{
                            if(users.length > 0){
                                let temp_obj = users[0];
                                let user = {
                                    user_id: temp_obj['id'],
                                    full_name: (temp_obj['full_name'])?temp_obj['full_name']:'',
                                    email: (temp_obj['email'])?temp_obj['email']:'',
                                    phone: (temp_obj['phone'])?temp_obj['phone']:'',
                                    profile_pic: (temp_obj['profile_pic'])?constants.API_URL+'profile_pic/'+temp_obj['profile_pic']:'',
                                    title: (temp_obj['company_user_role'])?temp_obj['company_user_role']:'',
                                    company_name: (temp_obj['company_name'])?temp_obj['company_name']:'',
                                    company_email: (temp_obj['company_email'])?temp_obj['company_email']:'',
                                    company_website: (temp_obj['company_website'])?temp_obj['company_website']:'',
                                    created_date:(temp_obj['created_date'])?temp_obj['created_date']:'',
                                }
                                return done({status : 1,data:user}) 
                                            
                                
                            }else{
                                return done({ status : 0 , message : 'Unable to fetch userdata.Try Again!' })
                            }
                        }
                    })
                }
            })
        },
        remove_file: function (path) {
            return fs.unlink(path, err => console.log("file remove err : ", err));
        }
}
}
