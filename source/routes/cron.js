var express = require('express');
var router = express.Router();
var headers = {
    'key': 'value',
};
var rest = require('restler');
var apiurl = '';
var async =require('async');
var func  = require('../config/functions');
var axios = require('axios');
var functions = func.func();
var moment = require('moment');
var eml = require('../services/email');
var msg = require('../config/messages');
var messages = msg.messages;
var emailservice = eml.func();
var generalfunction = require('../services/general');
var general = generalfunction.func();
var fs = require('fs');


const constants = require('../config/constants');
/*
Cron for update candidate exam result from thirdparty
*/
router.get('/cron/student/updateexamresult',(req,res)=>{
    req.getConnection((err,connection)=>{
        if(err){
            response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
            res.send(response);
        }else{    
            axios({
                method: 'get',
                url: 'https://coderbyte.com/api/zapier/triggers/completed?api_key=11f1f861ffcdd83b19938eacf660d091',
                responseType: 'json'
              })
                .then(function (resultObject) {
                    // console.log("Result1",typeof(resultObject.status),resultObject.status);
                    // console.log("DATA: ",resultObject.data,resultObject.data.length,typeof(resultObject.data));
                    
                    if(resultObject.status == 200){
                        if(resultObject.data.length > 0){
                          


                            // Process data start from here
                            let getGivenExams = `SELECT SS.*,U.email as email,S.skill_key as skill_key FROM student_skill AS SS LEFT JOIN user AS U ON SS.user_id = U.id LEFT JOIN skills AS S ON SS.skill_id = S.id WHERE SS.skill_exam_status = 1 OR SS.skill_exam_status = 2`;
                            connection.query(getGivenExams,(err,givenexams)=>{
                                if(err){
                                    response = general.response_format(false, messages.OOPS, {});
                                    res.send(response);
                                }else{
                                  // var created_date = moment(new Date()).format('MM-DD-YYYY hh:mmA');
                                  var created_date = moment().tz('America/New_York').format('MM-DD-YYYY h:mm A');
                                  fs.writeFile('crondata.txt', '', function(){
                                    fs.writeFile('crondata.txt', created_date, function(){
                                      
                                    })
                                  })
                                
                                    if(givenexams.length > 0){
                                      console.log("Given Exams by user:")
                                      async.forEach(givenexams,(skillexam,skillexamCb)=>{
                                        console.log("Given Exams by user:",skillexam.email,skillexam.skill_key);
                                        let student_email = skillexam.email;
                                        let full_skill_key = (skillexam.skill_key)?skillexam.skill_key.trim():'';
                                        let split_skill_key = full_skill_key.split(':')
                                        let skill_key = (split_skill_key.length > 1)?split_skill_key[1]:full_skill_key;
                                        
                                        // Get All object from coderbyte result which matches with object user email and skill id 
                                        let matched_obj = resultObject.data.filter((obj)=>{
                                          return obj.email === student_email && obj.test_id === skill_key;
                                        })
                                        if(matched_obj.length > 0){
                                          // console.log("matched object ",matched_obj[0])
                                          // console.log("skill deetail:",skillexam.is_default_skill);
                                          let update_skill_status = 1;
                                          if(matched_obj[0].final_score >= 70){
                                            console.log("PASSS",matched_obj)
                                            update_skill_status = 3;
                                          }else{
                                            console.log("FAIL",matched_obj)
                                            update_skill_status = 2;
                                          }
                                          connection.beginTransaction((err)=>{ 
                                            if(err){
                                              skillexamCb();
                                            }else{
                                              // Student skill examm result status update query
                                              let update_skill_exam_status = `UPDATE student_skill SET skill_exam_status = '${update_skill_status}' WHERE id = '${skillexam.id}' AND user_id = '${skillexam.user_id}'`;
                                              connection.query(update_skill_exam_status,(err,statusUpdated)=>{
                                                if(err){
                                                  connection.rollback(function(){
                                                    skillexamCb();
                                                  });
                                                }else{
                                                  if(skillexam.is_default_skill === 1 && update_skill_status == 3){
                                                    // update query to update progress in user table if user passed final_score >= 70
                                                    let update_student_progress_status = `UPDATE user SET current_progress_status = 1 WHERE id = '${skillexam.user_id}';`
                                                    connection.query(update_student_progress_status,(err,currentProgressUpdated)=>{
                                                      if(err){
                                                        connection.rollback(function(){
                                                          skillexamCb();
                                                        });
                                                      } else{
                                                        console.log("currentProgressUpdated",currentProgressUpdated)
                                                        // default skill status updated in user and student skill table commit 
                                                        connection.commit(function(err) {
                                                            if (err) {
                                                                connection.rollback(function() {
                                                                  skillexamCb();
                                                                });
                                                            } else {
                                                              skillexamCb(null);
                                                            }
                                                        });
                                                      }
                                                    })
                                                  }else{
                                                    // Not default skill Normal skill status updated commit 
                                                    connection.commit(function(err) {
                                                      if (err) {
                                                            connection.rollback(function() {
                                                              skillexamCb();
                                                            });
                                                        } else {
                                                          console.log("Commited")
                                                          skillexamCb();
                                                        }
                                                    });
                                                  }
                                                }
                                              })
                                            }                                          
                                          })                                                                                                                              
                                        }else{
                                          // Result not found till in coderbyte result object
                                          skillexamCb();
                                        }                                        
                                      },(err)=>{                                        
                                          console.log("completed",err); 
                                          response = general.response_format(true, messages.SUCCESS, {});
                                          res.send(response);
                                      })
                                    }else{
                                      console.log("Given Exams by user:eeeeeee")
                                        response = general.response_format(true, messages.SUCCESS,[]);
                                        res.send(response);
                                    }
                                }
                            })                            
                        }else{
                            response = general.response_format(true, messages.SUCCESS,[]);
                            res.send(response);
                        }
                    }else{
                        response = general.response_format(false, messages.OOPS,{});
                        res.send(response);
                    }
                }).catch(error => {
                    console.log("error1",error);
                    response = general.response_format(false, messages.OOPS,{});
                    res.send(response);
                });           
        }
    })
})
/*
This is migration function on change functionality
Do not run this function
*/
router.get('/cron/student/updateexamresultexistingdata',(req,res)=>{
  req.getConnection((err,connection)=>{
      if(err){
          response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
          res.send(response);
      }else{    
          axios({
              method: 'get',
              url: 'https://coderbyte.com/api/zapier/triggers/completed?api_key=11f1f861ffcdd83b19938eacf660d091',
              responseType: 'json'
            })
              .then(function (resultObject) {
                  // console.log("Result1",typeof(resultObject.status),resultObject.status);
                  // console.log("DATA: ",resultObject.data,resultObject.data.length,typeof(resultObject.data));
                  
                  if(resultObject.status == 200){
                      if(resultObject.data.length > 0){
                        


                          // Process data start from here
                          let getGivenExams = `SELECT SS.*,U.email as email,U.current_progress_status as current_progress_status,S.skill_key as skill_key FROM student_skill AS SS LEFT JOIN user AS U ON SS.user_id = U.id LEFT JOIN skills AS S ON SS.skill_id = S.id WHERE SS.skill_exam_status = 1 OR SS.skill_exam_status = 2`;
                          connection.query(getGivenExams,(err,givenexams)=>{
                              if(err){
                                  response = general.response_format(false, messages.OOPS, {});
                                  res.send(response);
                              }else{
                                // var created_date = moment(new Date()).format('MM-DD-YYYY hh:mmA');
                                var created_date = moment().tz('America/New_York').format('MM-DD-YYYY h:mm A');
                                fs.writeFile('crondata.txt', '', function(){
                                  fs.writeFile('crondata.txt', created_date, function(){
                                    
                                  })
                                })
                              
                                  if(givenexams.length > 0){
                                    console.log("Given Exams by user:")
                                    async.forEach(givenexams,(skillexam,skillexamCb)=>{
                                      console.log("Given Exams by user:",skillexam.email,skillexam.skill_key,skillexam.current_progress_status);
                                      let student_email = skillexam.email;
                                      let student_current_progress_status = skillexam.current_progress_status;
                                      let full_skill_key = (skillexam.skill_key)?skillexam.skill_key.trim():'';
                                      let split_skill_key = full_skill_key.split(':')
                                      let skill_key = (split_skill_key.length > 1)?split_skill_key[1]:full_skill_key;
                                      
                                      // Get All object from coderbyte result which matches with object user email and skill id 
                                      let matched_obj = resultObject.data.filter((obj)=>{
                                        return obj.email === student_email && obj.test_id === skill_key;
                                      })
                                      if(matched_obj.length > 0){
                                        // console.log("matched object ",matched_obj[0])
                                        // console.log("skill deetail:",skillexam.is_default_skill);
                                        let update_skill_status = 1;
                                        if(matched_obj[0].final_score >= 70){
                                          console.log("PASSS",matched_obj)
                                          update_skill_status = 3;
                                        }else{
                                          console.log("FAIL",matched_obj)
                                          update_skill_status = 2;
                                        }
                                        connection.beginTransaction((err)=>{ 
                                          if(err){
                                            skillexamCb();
                                          }else{
                                            // Student skill examm result status update query
                                            let update_skill_exam_status = `UPDATE student_skill SET skill_exam_status = '${update_skill_status}' WHERE id = '${skillexam.id}' AND user_id = '${skillexam.user_id}'`;
                                            connection.query(update_skill_exam_status,(err,statusUpdated)=>{
                                              if(err){
                                                connection.rollback(function(){
                                                  skillexamCb();
                                                });
                                              }else{
                                                if(skillexam.is_default_skill === 1 && update_skill_status == 3){
                                                  // update query to update progress in user table if user passed final_score >= 70
                                                  if(student_current_progress_status === 0){
                                                    let update_student_progress_status = `UPDATE user SET current_progress_status = 1 WHERE id = '${skillexam.user_id}';`
                                                    connection.query(update_student_progress_status,(err,currentProgressUpdated)=>{
                                                      if(err){
                                                        connection.rollback(function(){
                                                          skillexamCb();
                                                        });
                                                      } else{
                                                        console.log("currentProgressUpdated",currentProgressUpdated)
                                                        // default skill status updated in user and student skill table commit 
                                                        connection.commit(function(err) {
                                                            if (err) {
                                                                connection.rollback(function() {
                                                                  skillexamCb();
                                                                });
                                                            } else {
                                                              skillexamCb(null);
                                                            }
                                                        });
                                                      }
                                                    })
                                                  }else{
                                                    skillexamCb();
                                                  }                                                  
                                                }else{
                                                  // Not default skill Normal skill status updated commit 
                                                  connection.commit(function(err) {
                                                    if (err) {
                                                          connection.rollback(function() {
                                                            skillexamCb();
                                                          });
                                                      } else {
                                                        console.log("Commited")
                                                        skillexamCb();
                                                      }
                                                  });
                                                }
                                              }
                                            })
                                          }                                          
                                        })                                                                                                                              
                                      }else{
                                        // Result not found till in coderbyte result object
                                        skillexamCb();
                                      }                                        
                                    },(err)=>{                                        
                                        console.log("completed",err); 
                                        response = general.response_format(true, messages.SUCCESS, {});
                                        res.send(response);
                                    })
                                  }else{
                                    console.log("Given Exams by user:eeeeeee")
                                      response = general.response_format(true, messages.SUCCESS,[]);
                                      res.send(response);
                                  }
                              }
                          })                            
                      }else{
                          response = general.response_format(true, messages.SUCCESS,[]);
                          res.send(response);
                      }
                  }else{
                      response = general.response_format(false, messages.OOPS,{});
                      res.send(response);
                  }
              }).catch(error => {
                  console.log("error1",error);
                  response = general.response_format(false, messages.OOPS,{});
                  res.send(response);
              });           
      }
  })
})
/*
Cron function for send new candidate email after 15 days of registration
*/
router.get('/cron/student/send_last_two_student',(req,res)=>{
  req.getConnection((err,connection)=>{
      if(err){
        response = general.response_format(false, messages.OOPS,{});
        res.send(response);
      }else{  
        let date = moment();
       var newdate = date.subtract(15, 'day').format("YYYY-MM-DD")
       
       let sql = `SELECT * FROM user WHERE status = 1 AND role_id = 2 AND DATE_FORMAT(created_date,'%Y-%m-%d') = '${newdate}';`;
        console.log(sql)
       connection.query(sql,(err,users)=>{
          if(err){
            response = general.response_format(false, messages.OOPS,{});
            res.send(response);
          }else{
            console.log(users)
            var sql = "SELECT * FROM `email_template` WHERE emailtemplate_id = 16; ";
            connection.query(sql, function (err, email_template) {
                if (err) {

                  response = general.response_format(false, messages.OOPS,{});
                  res.send(response);
                } else {
                    var cutomurl = constants.APP_URL+"candidate/specsheet"
                    
                    async.forEachOf(users, function (element, key, dataCB) {
                      var html = email_template[0].emailtemplate_body;
                      var html = html.replace(/{first_name}/gi, (element.first_name) ? element.first_name : '');
                      var html = html.replace(/{last_name}/gi, (element.last_name) ? element.last_name : '');
                    
                      var html = html.replace(/{profile_url}/gi, (cutomurl) ? cutomurl : '');
                      var data = { to: element.email, subject: email_template[0].emailtemplate_subject, html: html };
                      console.log("mail call", html)
                      emailservice.sendMailnew(req, data, function (result) {
                        dataCB()
                      });

                      
                    }, function (err) {
                        if (err) {
                          response = general.response_format(false, messages.OOPS,{});
                          res.send(response);
                        } else {
                           console.log("in response")
                           response = general.response_format(false, messages.SUCCESS,{});
                           res.send(response);
                        }
                    });
                    
                    
                    

                }
            });
          }
        })
      }
    })
})
/*
This is migration function on change functionality
Do not run this function
*/
router.get('/cron/student/update_education_start_end_date',(req,res)=>{
  req.getConnection((err,connection)=>{
      if(err){
          response = general.response_format(false, messages.DATABASE_CONNECTION_ERROR, {});
          res.send(response);
      }else{
        // Get student education data
        let sql = `SELECT *,DATE_FORMAT(year, '%Y') as year FROM student_education`;
        connection.query(sql,(err,educations)=>{
          if(err){
              response = general.response_format(false, messages.OOPS, {});
              res.send(response);
          }else{
            if(educations.length > 0){
              console.log("Update education date:");
              async.forEach(educations,(education,educationCb)=>{               
                connection.beginTransaction((err)=>{ 
                  if(err){
                    educationCb();
                  }else{
                    // Student education start date and end date update query
                    var year_date = (education.year) ? moment(new Date('01/01/'+education.year)).format("YYYY-MM-DD") : moment().startOf("year").format("YYYY-MM-DD");
                    console.log("Update education date:", year_date);
                    let update_education_date = `UPDATE student_education SET start_date = '${year_date}', end_date = '${year_date}' WHERE id = '${education.id}'`;
                    // console.log("Update education date:",update_education_date);
                    connection.query(update_education_date,(err,educationUpdated)=>{
                      if(err){
                        connection.rollback(function(){
                          educationCb();
                        });
                      }else{
                        // console.log("educationUpdated",educationUpdated);
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                  educationCb();
                                });
                            } else {
                              educationCb(null);
                            }
                        });
                      }
                    })
                  }
                })
              },(err)=>{
                  console.log("completed",err); 
                  response = general.response_format(true, messages.SUCCESS, {});
                  res.send(response);
              })
            }else{
                console.log("Update education date length else")
                response = general.response_format(true, messages.SUCCESS,[]);
                res.send(response);
            }
          }
        })
      }
  })
})

module.exports = router;

