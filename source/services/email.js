var moment = require('moment');
var msg = require('../config/messages');
var messages = msg.messages;
var nodemailer = require('nodemailer');
var constants = require('../config/constants');
let response = {}

exports.func = function () {
    return {
       
        /* Send Email with attachment */
        sendMail: function (req, data, done) {

            var transporter = nodemailer.createTransport({
                debug: true,
                host: constants.SMTP.SMTP_HOST,
                secureConnection: false, // true for 465, false for other ports
                port: constants.SMTP.SMTP_PORT,
                tls: {
                    cipher: 'SSLv3'
                },
                auth: {
                    user: constants.SMTP.SMTP_EMAIL,
                    pass: constants.SMTP.SMTP_PASSWORD,
                }
            });
            var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
            req.getConnection(function (err, connection) {
                var sql = "INSERT INTO email_tracking (from_email, to_email,subject,content,status, read_status,created_date) VALUES ?";
                var values = [
                    ['', data.to, data.subject, '', 0, 0, created_date]
                ];

                connection.query(sql, [values], function (err, emailtracking) {//console.log(signup);return;
                    var newtrackingid = emailtracking.insertId
                    var trackurl = constants.API_URL + "user/trackemail?id="+newtrackingid;
                    var email_message = `<p><img style="display: block; margin-left: auto; margin-right: auto;" src="${constants.API_URL}/setting_favicon_image/logo-mini.png" alt="My Application" width="112" height="112" /></p>
                        <p>&nbsp;</p>
                        ${data.html}
                        <p><img src=${trackurl}></p>
                        <p>Thank you,</p>
                        <p>Shtudy</p>`;
                    let mailOptions = {
                        from: (typeof data.from != 'undefined' && data.from != '') ? data.from : constants.MAIL_FROM,
                        to: data.to, // list of receivers
                        subject: data.subject, // Subject line
                        html: email_message
                        //attachments: data.attachment != "" ? [{ path: data.attachment }] : [] //attachments
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            connection.query("UPDATE email_tracking SET content = ?,status = ?,modified_date=? WHERE id = ?", [email_message,0,created_date,newtrackingid], function (err,updateres) {console.log("errrrrr",err) })
                            response.status = 0;
                            response.message = error;
                            return done(response);
                        }
                        else {
                            connection.query("UPDATE email_tracking SET content = ?,status = ?,modified_date=? WHERE id = ?", [email_message,1,created_date,newtrackingid], function (err,updateres) {console.log("errrrrr",err) })
                            console.log('Message sent:', info.messageId);
                            // console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
                            response.status = 1;
                            response.message = 'Mail has been sent to email-id';
                            return done(response);
                        }
                    });


                })
            })


            
        },
        sendMailnew: function (req, data, done) {

            var transporter = nodemailer.createTransport({
                debug: true,
                host: constants.SMTP.SMTP_HOST,
                secureConnection: false, // true for 465, false for other ports
                port: constants.SMTP.SMTP_PORT,
                tls: {
                    cipher: 'SSLv3'
                },
                auth: {
                    user: constants.SMTP.SMTP_EMAIL,
                    pass: constants.SMTP.SMTP_PASSWORD,
                }
            });
            var created_date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
            req.getConnection(function (err, connection) {
                var sql = "INSERT INTO email_tracking (from_email, to_email,subject,content,status, read_status,created_date) VALUES ?";
                var values = [
                    ['', data.to, data.subject, '', 0, 0, created_date]
                ];

                connection.query(sql, [values], function (err, emailtracking) {//console.log(signup);return;
                    var newtrackingid = emailtracking.insertId
                    var trackurl = constants.API_URL + "user/trackemail?id="+newtrackingid;
                    var email_message = data.html;
                    let mailOptions = {
                        from: (typeof data.from != 'undefined' && data.from != '') ? data.from : constants.MAIL_FROM,
                        to: data.to, // list of receivers
                        subject: data.subject, // Subject line
                        html: email_message
                        //attachments: data.attachment != "" ? [{ path: data.attachment }] : [] //attachments
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            connection.query("UPDATE email_tracking SET content = ?,status = ?,modified_date=? WHERE id = ?", [email_message,0,created_date,newtrackingid], function (err,updateres) {console.log("errrrrr",err) })
                            response.status = 0;
                            response.message = error;
                            return done(response);
                        }
                        else {
                            connection.query("UPDATE email_tracking SET content = ?,status = ?,modified_date=? WHERE id = ?", [email_message,1,created_date,newtrackingid], function (err,updateres) {console.log("errrrrr",err) })
                            console.log('Message sent:', info.messageId);
                            // console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
                            response.status = 1;
                            response.message = 'Mail has been sent to email-id';
                            return done(response);
                        }
                    });


                })
            })


            
        }
    }
}