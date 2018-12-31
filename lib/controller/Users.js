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

exports.SignOut = function (req, res) {
    if (req.decoded.success == true) {
        res.clearCookie('token');
        res.send({
            status: true,
            message: 'Successfully Sign out'
        });
    } else {
        res.send({
            status: true,
            message: 'Token already expires'
        });
    }
};

exports.getCoockies = function (req, res) {
    res.send(req.decoded.logedinuser)
};

exports.authUser = function (userdetails, res) {
    connection.acquire(function (err, con) {

        var encpass = encrypt(userdetails.password)

        con.query("SELECT id,name,firstlogin,role,companyid from user WHERE email =? AND password = ?", [userdetails.email, encpass], function (err, result) {
            if (err) {

                res.send({
                    success: false,
                    type: "error",
                    title: "Oops!",
                    message: 'Somthing went wrong, Please try again.'
                });
            } else {
                if (result.length > 1 || result.length <= 0) {
                    res.json({
                        success: false,
                        type: "error",
                        title: "Oops!",
                        message: 'Login cridentials does not matched.'
                    });
                }
                if (result.length == 1) {
                    if (result[0].role === 'Superadmin') {
                        var sql = "select 'welcome'";
                    } else {
                        var sql = "SELECT approval from companymaster WHERE id = " + result[0].companyid;
                    }
                    con.query(sql, function (err, companyapproval) {
                        if (err) {
                            res.send({
                                success: false,
                                type: "error",
                                title: "Oops!",
                                message: 'Somthing went wrong, Please try again.'
                            });
                        } else {

                            if (result[0].role === 'Superadmin') {
                                var payload = {
                                    logedinuser: result[0]
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
                                    type: "success",
                                    title: "Welcome!",
                                    message: 'logged in successfully.',
                                    firstlogin: result[0].firstlogin
                                });
                            } else {
                                if (companyapproval[0].approval === 0) {
                                    res.send({
                                        success: false,
                                        type: "error",
                                        title: "Oops!",
                                        message: 'your company did not approved by superadmin please contact with your vendor for aproval.'
                                    });
                                } else {
                                    var payload = {
                                        logedinuser: result[0]
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
                                        type: "success",
                                        title: "Welcome!",
                                        message: 'logged in successfully.',
                                        firstlogin: result[0].firstlogin
                                    });
                                }
                            }

                        }
                    });
                }
            }
        });
    });

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


exports.ListCompanyies = function (req, res) {
    if (req.decoded.logedinuser.role === "Superadmin" && req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query("SELECT id,name,owner,email,mobile1 FROM `companymaster`", function (err, result) {
                if (err) {
                    res.send({
                        status: 0,
                        type: "error",
                        title: "Oops!",
                        message: "Something went wrong."
                    });
                } else {
                    res.send(result)
                }
            });
        });
    } else {
        res.send({
            status: 0,
            type: "error",
            title: "Sorry!",
            message: "You are not authorised person."
        });
    }
};


exports.GetCompanyDetails = function (req, res) {
    if (req.decoded.logedinuser.role === "Superadmin" && req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query("SELECT * FROM `companymaster` WHERE id = " + req.params.companyid, function (err, result) {
                if (err) {
                    res.send({
                        status: 0,
                        type: "error",
                        title: "Oops!",
                        message: "Something went wrong."
                    });
                } else {
                    res.send(result)
                }
            });
        });
    } else {
        res.send({
            status: 0,
            type: "error",
            title: "Sorry!",
            message: "You are not authorised person."
        });
    }
};


exports.ValidateEmail = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query("SELECT * FROM `user` WHERE email = '" + req.params.email + "'", function (err, result) {
                if (err) {
                    res.send({
                        status: 0,
                        type: "error",
                        title: "Oops!",
                        message: "Something went wrong."
                    });
                } else {
                    if (result.length > 0) {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Email id already exist"
                        });
                    } else {
                        res.send({
                            status: 2,
                            type: "success",
                            title: "Ok!",
                            message: ""
                        });
                    }
                }
            });
        });
    } else {
        res.send({
            status: 0,
            type: "error",
            title: "Sorry!",
            message: "You are not authorised person."
        });
    }
};


exports.DeleteCompanyDetails = function (req, res) {
    if (req.decoded.logedinuser.role === "Superadmin" && req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query("SELECT (SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as usersincomp,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as productscnt,(SELECT COUNT(*) FROM pomaster WHERE pomaster.companyid = companymaster.id) as poscnt,(SELECT COUNT(*) FROM ordermaster WHERE ordermaster.companyid = companymaster.id) as orderscnt,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as inquiriescnt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id) as customerscnt,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as brandscnt  FROM `companymaster` WHERE id = " + req.params.companyid, function (err, result) {
                if (err) {
                    res.send({
                        status: 0,
                        type: "error",
                        title: "Oops!",
                        message: "Something went wrong."
                    });
                } else {
                    if (result[0].usersincomp > 0 || result[0].productscnt > 0 || result[0].poscnt > 0 || result[0].orderscnt > 0 || result[0].inquiriescnt > 0 || result[0].customerscnt > 0 || result[0].brandscnt > 0) {
                        res.send({
                            status: 0,
                            type: "error",
                            title: "Oops!",
                            message: "You can`t delete this company because, this company belongs with other records in system."
                        });
                    } else {

                        con.query("DELETE FROM `companymaster` WHERE id = " + req.params.companyid, function (err, result) {
                            if (err) {
                                res.send({
                                    status: 0,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went wrong."
                                });
                            } else {
                                res.send({
                                    status: 0,
                                    type: "success",
                                    title: "Done!",
                                    message: "record deleted successfully"
                                });
                            }
                        });
                    }
                }
            });
        });
    } else {
        res.send({
            status: 0,
            type: "error",
            title: "Sorry!",
            message: "You are not authorised person."
        });
    }
};


exports.SaveCompanyData = function (req, res) {
    if (req.decoded.logedinuser.role === "Superadmin" && req.decoded.success == true) {
        req.body.companyDetails.logo = req.file ? req.file.filename : '';
        req.body.companyDetails.createdby = req.decoded.logedinuser.id;
        connection.acquire(function (err, con) {
            if (!req.body.companyDetails.id) {
                con.query("INSERT INTO `companymaster` set ?", req.body.companyDetails, function (err, result) {
                    if (err) {
                        try {
                            fs.unlinkSync(req.file.path);
                            console.log('successfully deleted /tmp/hello');
                        } catch (err) {
                            // handle the error
                        }
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                        con.release();
                    } else {
                        var insertedid = result.insertId

                        var passwordtxt = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 6; i++) {
                            passwordtxt += possible.charAt(Math.floor(Math.random() * possible.length));
                        }

                        var encpass = encrypt(passwordtxt)

                        con.query("INSERT INTO `user`(`name`, `mobile`,`email`,`role`,`companyid`,`createdby`,`password`) VALUES (?,?,?,?,?,?,?)", [req.body.companyDetails.owner, req.body.companyDetails.mobile1, req.body.companyDetails.email, "Admin", insertedid, req.decoded.logedinuser.id, encpass], function (err, result) {
                            console.log(err);
                            if (err) {
                                res.send({
                                    status: 1,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went wrong, Please try again."
                                });
                                con.release();
                            } else {

                                const mailOptions = {
                                    from: 'mhatremayur2520@gmail.com', // sender address
                                    to: req.body.companyDetails.email, // list of receivers
                                    subject: 'L.N. ', // Subject line
                                    html: 'Dear ' + req.body.companyDetails.owner + '<br><br><br><h1 style="font-weight:bold;text-align:center;">' + passwordtxt + '</h1> <br> <p>enter this as a  password for the app.<br><br><br><br> <div style="float:left;text-align:left;">Thanks, <br> Admin <br> (L.N. software Pvt. Ltd.)</div></p>' // plain text body
                                };



                                transporter.sendMail(mailOptions, function (err, info) {
                                    if (err)
                                        console.log(err)
                                    else
                                        console.log(info);
                                });


                                res.send({
                                    status: 0,
                                    type: "success",
                                    title: "Good!",
                                    message: "Record inserted successfully."
                                });
                                con.release();
                            }
                        });

                    }
                });
            }
            if (req.body.companyDetails.id) {
                con.query("UPDATE `companymaster` set ? WHERE id = ?", [req.body.companyDetails, req.body.companyDetails.id], function (err, result) {
                    if (err) {
                        try {
                            fs.unlinkSync(req.file.path);
                            console.log('successfully deleted /tmp/hello');
                        } catch (err) {
                            // handle the error
                        }
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                        con.release();
                    } else {
                        res.send({
                            status: 0,
                            type: "success",
                            title: "Good!",
                            message: "Record updated successfully."
                        });
                        con.release();
                    }
                });
            }
        });
    } else {
        res.send({
            status: 0,
            type: "error",
            title: "Sorry!",
            message: "You are not authorised person."
        });
    }

};