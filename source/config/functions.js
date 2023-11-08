var jwt = require('jsonwebtoken');
const constants = require('./constants');
var msg = require('../config/messages');
var moment = require('moment');
var messages = msg.messages;
exports.func = function(){
    return {
        /* function to check whether required req param is exist in post or not*/
        validateReqParam : function(post, reqparam){
            var remain = [];
            var req = [];            
            for(var i=0;i<reqparam.length;i++){                
                if(typeof post[reqparam[i]]!='undefined'){                                                           
                    if(post[reqparam[i]]==''){
                        req.push(reqparam[i]);
                    }                    
                }else{                    
                    remain.push(reqparam[i]);
                }
            }              
            var respose = {'missing':remain,'blank':req};                  
            return respose;
        },
        /* function to load error message template for blank/missing req params for all APIs*/
        loadErrorTemplate: function(elem){
            var missing = elem.missing;    
            var blank_str = '', missing_str = '';    
            if(missing.length>0){
                missing_str = missing.join(',');        
                missing_str+=' missing';
            }
            var blank = elem.blank;    
            if(blank.length>0){        
                blank_str = blank.join(',');        
                blank_str+=' should not be blank';
            }
            var s = [missing_str, blank_str];
            var str = s.join(' \n ');
            return str;
        },
        /* function to load error message template for blank/missing req params for all APIs*/
        validateNumber : function (phone) {
            if(typeof phone != "undefined" && phone != "")
            {
                // Require `PhoneNumberFormat`.
                var PNF = require('google-libphonenumber').PhoneNumberFormat;

                // Get an instance of `PhoneNumberUtil`.
                var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

                // Parse number with country code.
                var phoneNumber = phoneUtil.parse(phone, 'US');
                var national_phone = phoneUtil.format(phoneNumber, PNF.NATIONAL);
                var international_phone = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
                var E164_phone = phoneUtil.format(phoneNumber, PNF.E164);
                var RFC3966 = phoneUtil.format(phoneNumber, PNF.RFC3966);
                var phone_data = {};
                phone_data = {
                    national_phone: (national_phone.indexOf(' ') >= 0)?national_phone.replace(/\s/g, "") :national_phone,
                    international_phone: (international_phone.indexOf(' ') >= 0)?international_phone.replace(/\s/g, "") :international_phone,
                    number : (phoneNumber.values_)[2],
                    country_code : (phoneNumber.values_)[1],
                    E164_phone: E164_phone,
                    RFC3966:RFC3966
                }
                return phone_data;
            }
            else{
                return {}
            }
        },
        verifyTokenAdmin (req,res,next){
            var token = req.headers['token'];
            console.log('Token',token,req.body)
            if(!token){
                return res.send({
                    status : -2,
                    message : 'No token provided'
                });
            } else{
                jwt.verify(token,constants.JWT_SECRET_KEY,{ignoreExpiration:true},function(err,decoded){
                    if(err){  
                        console.log("eRR",err)                                              
                        if (err.name === 'TokenExpiredError') {
                            return res.send({
                                status : -2,
                                message : 'JWT has expired. Please login again, this is for your security!'
                            }); 
                          }else{
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate token.'
                            }); 
                          }
                    } else{
                        
                        console.log("both id",decoded.user_id,req.body.admin_id)
                        if(req.body.admin_id != decoded.user_id)
                        {
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate user.'
                            }); 
                        }else{
                            req.getConnection(function (err, connection) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                } else {
                                    
                                    var sql = "SELECT id,status,auth_token_verify_time FROM user WHERE id = '" + decoded.user_id + "'";
                                    connection.query(sql, function (err, rows) {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        } else {
                                            if (rows.length > 0) {
                                                if (rows[0].status == 1) {
                                                    if(constants.AUTO_LOGOUT == 1){
                                                        var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                                        var resettime = moment(rows[0].auth_token_verify_time).format('YYYY-MM-DD HH:mm:ss');
                                                        var diff = moment.duration(moment(currenttime).diff(moment(resettime))).asMinutes();
                                                        console.log(currenttime,resettime,diff)
                                                        
                                                        if(diff > constants.AUTO_LOGOUT_TIME){
                                                            return res.send({
                                                                status : -2,
                                                                message : messages.SESSION_EXPIRED
                                                            }); 
                                                        }else{
                                                            //update time and go ahead
                                                            var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                                            connection.query("UPDATE user SET auth_token_verify_time = '" + created_date + "' WHERE id = '" + rows[0].id + "'", function (err, data) {
                                                                if (err) {
                                                                    console.log("errrr",err)
                                                                    return res.send({
                                                                        status : -2,
                                                                        message : messages.SESSION_EXPIRED
                                                                    }); 
                                                                } else {
                                                                    console.log("elseeee")
                                                                    next();
                                                                }
                                                            })
                                                           
                                                        }
                                                    }else{
                                                        next();
                                                    }
                                                    
                                                   
                                                } else{
                                                    return res.send({
                                                        status : -2,
                                                        message : messages.INACTIVE_ACCOUNT
                                                    }); 
                                                }
                                             
                                            } else {
                                                return res.send({
                                                    status : -2,
                                                    message : messages.USER_NOT_FOUND
                                                }); 
                                            }
                                        }
                                    });
                                }
                            });
                           
                        }
                       
                    }
                });
            }
        },
        verifyTokenFront (req,res,next){
            // console.log("req.header",req.headers)
            var token = req.headers['token'];
            if(!token){
                return res.send({
                    status : -2,
                    message : 'No token provided'
                });
            } else{
                jwt.verify(token,constants.JWT_SECRET_KEY,{ ignoreExpiration: true },function(err,decoded){
                    console.log("errrr==========>",err);
                    if(err){
                        if (err.name === 'TokenExpiredError') {
                            return res.send({
                                status : -2,
                                message : 'JWT has expired. Please login again, this is for your security!'
                            }); 
                          }else{
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate token.'
                            }); 
                          }
                       
                    } else{
                        
                        console.log("both id",decoded.user_id,req.body)
                        if(req.body.user_id != decoded.user_id)
                        {
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate user.'
                            }); 
                        }else{
                            //check for user active or not
                            req.getConnection(function (err, connection) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                } else {
                                    console.log("both id",decoded.user_id)
                                    var sql = "SELECT id,status,auth_token_verify_time FROM user WHERE id = '" + decoded.user_id + "'";
                                    connection.query(sql, function (err, rows) {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        } else {
                                            if (rows.length > 0) {
                                                if (rows[0].status == 1) {
                                                    if(constants.AUTO_LOGOUT == 1){
                                                        var currenttime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                                        var resettime = moment(rows[0].auth_token_verify_time).format('YYYY-MM-DD HH:mm:ss');
                                                        var diff = moment.duration(moment(currenttime).diff(moment(resettime))).asMinutes();
                                                        console.log(currenttime,resettime,diff)
                                                        
                                                        if(diff > constants.AUTO_LOGOUT_TIME){
                                                            return res.send({
                                                                status : -2,
                                                                message : messages.SESSION_EXPIRED
                                                            }); 
                                                        }else{
                                                            //update time and go ahead
                                                            var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
                                                            connection.query("UPDATE user SET auth_token_verify_time = '" + created_date + "' WHERE id = '" + rows[0].id + "'", function (err, data) {
                                                                if (err) {
                                                                    console.log("errrr",err)
                                                                    return res.send({
                                                                        status : -2,
                                                                        message : messages.SESSION_EXPIRED
                                                                    }); 
                                                                } else {
                                                                    console.log("elseeee")
                                                                    next();
                                                                }
                                                            })
                                                           
                                                        }
                                                    }else{
                                                        next();
                                                    }
                                                } else{
                                                    return res.send({
                                                        status : -2,
                                                        message : messages.INACTIVE_ACCOUNT
                                                    }); 
                                                }
                                             
                                            } else {
                                                return res.send({
                                                    status : -2,
                                                    message : messages.USER_NOT_FOUND
                                                }); 
                                            }
                                        }
                                    });
                                }
                            });
                           
                        }
                       
                    }
                });
            }
        },
        
    };
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};