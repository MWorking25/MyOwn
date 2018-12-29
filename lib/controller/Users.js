// Users.js
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var express = require('express');
var nodemailer = require('nodemailer');
var connection = require('../Connection');
var fs = require('fs');
var app = express();

app.set('superSecret', process.env.JWT_SECRATE); // secret variable

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'mhatremayur2520@gmail.com', // generated ethereal user
        pass: '25031994@M' // generated ethereal password
    }
});

function encrypt(text) {
    try {
        if (text === null || typeof text === 'undefined') {
            return text;
        };
        var cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTED_KEY);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
    } catch (err) {
        console.log(err)
    }
    return crypted;
}

var verificationObject = [{}];

function getvaluesinObject(passedval) {
    var charindex = passedval.indexOf("=");
    var strindex = passedval.length;
    var field = passedval.substring(0, charindex).trim();
    var value = passedval.substring(charindex + 1, strindex);

    verificationObject[0][field] = value.trim();


};


exports.authUser = function (userdetails, res) {
    
                if (err) {
                    res.send({
                        success: false,
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    if (result.length > 1 || result.length <= 0) {
                        res.json({
                            success: false,
                            message: 'Login cridentials does not matched.'
                        });
                    }
                    if (result.length == 1) {
                        var payload = {
                            logedinuser:result[0]
                        }
                        var token = jwt.sign(payload, app.get('superSecret'), {
                            expiresIn: 28800 // expires in 24 hours = 86400
                        });

                        var d = new Date();
                        d.setTime(d.getTime() + (0.7 * 24 * 60 * 60 * 1000));
                        var expires = d.toUTCString();

                        res.cookie('token', token, {
                            expires: new Date(expires),
                            httpOnly: true
                        });
                        res.send({
                            success: true,
                            message: 'logged in successfully.'
                        });
                    }
                }
            
};

exports.ForgotPassword = function (userdetails, res) {

  

                if (err) {
                    res.send({
                        success: false,
                        message: 'Somthing went wrong, Please try again.'
                    });
                    mongoose.disconnect();
                } else {
                    if (result.length > 1 || result.length <= 0) {
                        res.json({
                            success: false,
                            message: 'Details does not matched.'
                        });
                    }
                    if (result.length == 1) {
                        var d = new Date();
                        d.setTime(d.getTime() + (0.1 * 24 * 60 * 60 * 1000));
                        var expires = d.toUTCString();

                        var otp = Math.floor(100000 + Math.random() * 900000);
                        var sentotp = encrypt(String(otp));
                        var userid = String(result[0].id);
                        res.cookie('otp', sentotp, {
                            expires: new Date(expires),
                            httpOnly: true
                        });
                        res.cookie('id', userid, {
                            expires: new Date(expires),
                            httpOnly: true
                        });

                        const mailOptions = {
                            from: 'mhatremayur2520@gmail.com', // sender address
                            to: result[0].contactdetails.email, // list of receivers
                            subject: 'Forgot Password', // Subject line
                            html: '<h1 style="font-weight:bold;text-align:center;">' + otp + '</h1> <br> <p>Please enter it for reset your password for CS portal.<br> This OTP is valid for 10 minuts. <br><br><br> <div style="float:left;text-align:left;">Thanks, <br> Admin <br> (CS Pvt. Ltd.)</div></p>' // plain text body
                        };



                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err)
                                console.log(err)
                            else
                                console.log(info);
                            res.send({
                                success: true,
                                message: 'OTP sent to your registered mobile number.'
                            });
                        });


                    }
                }
       

};

exports.verifyOTP = function (req, res) {
    var cookies = req.headers.cookie.split(';', 5);
    cookies.map(function (value) {
        getvaluesinObject(value)
    });

    var recievedotp = encrypt(String(req.params.otp))
    if (recievedotp === verificationObject[0].otp) {
        res.clearCookie('otp', {
            path: '/'
        });
        res.send({
            status: 0
        });
    } else {
        res.send({
            status: 1
        });
    }
};


exports.ResetPassword = function (req, res) {
    if (req.headers.cookie) {
        var cookies = req.headers.cookie.split(';', 5);
        cookies.map(function (value) {
            getvaluesinObject(value)
        });
        if (verificationObject[0].id) {
          
                        if (err) {
                            res.send({
                                status: 1,
                                message: 'Somthing went wrong, Please try again!'
                            });
                        } else {
                            res.send({
                                status: 0,
                                message: 'Password updated successfully, Thank you!'
                            });
                        }
                  
        } else {
            res.send({
                status: 1,
                message: 'Somthing went wrong, Please generate OTP again'
            });
        }
    } else {
        res.send({
            status: 1,
            message: 'Somthing went wrong, Please generate OTP again'
        });
    }
};


exports.SaveCompanyData = function(req,res)
{
        req.body.companyDetails.logo = req.file ? req.file.filename:'';
        connection.acquire(function (err, con) {
            con.query("INSERT INTO `companymaster` set ?",req.body.companyDetails, function (err, result) {
                if(err)
                {
                    try {
                        fs.unlinkSync(req.file.path);
                        console.log('successfully deleted /tmp/hello');
                      } catch (err) {
                        // handle the error
                      }
                    res.send({status:1,type:"error",title:"Oops!",message:"Something went wrong, Please try again."});
                    con.release();
                }
                else
                {
                            var insertedid = result.insertId
                    con.query("INSERT INTO `user`(`name`, `mobile`,`email`,`role`,`companyid`) VALUES (?,?,?,?,?)",[req.body.companyDetails.owner,req.body.companyDetails.mobile1,req.body.companyDetails.email,"Admin",insertedid], function (err, result) {
                        console.log(err);
                        if(err)
                        {
                            res.send({status:1,type:"error",title:"Oops!",message:"Something went wrong, Please try again."});
                            con.release();
                        }
                        else
                        {
                            var mainurl = 'http://localhost:8082/ResetPassword?'+result.insertId;
                            console.log(mainurl)
                            var shrturl = '';

                           

                            const mailOptions = {
                                from: 'mhatremayur2520@gmail.com', // sender address
                                to: req.body.companyDetails.email, // list of receivers
                                subject: 'Set New Password', // Subject line
                                html: '<a href="'+mainurl+'">Set New Password </a><br> <p>Click on above link to set your new password for login into portal.<br>  <br><br><br> <div style="float:left;text-align:left;">Thanks, <br> Admin <br> (L.N. Infotech Pvt. Ltd.)</div></p>' // plain text body
                            };
    
    
    
                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err)
                                    console.log(err)
                                else
                                    console.log(info);
                            });
    
                           
                                res.send({status:0,type:"success",title:"Good!",message:"Record inserted successfully."});
                                con.release();
                        }
                    });
                   
                }
            });
        });

};