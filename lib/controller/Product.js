// Product.js
var connection = require('../Connection');

exports.SaveBrandDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {

            if (!req.body[0].id) {
                var sql = 'INSERT INTO `brand`(`name`, `description`,`createdby`, `companyid`) VALUES ("' + req.body[0].name + '","' + req.body[0].description + '",' + req.decoded.logedinuser.id + ',' + (req.decoded.logedinuser.companyid || 0) + ')';
                var message = 'New Record inserted successfully';
            }

            if (req.body[0].id) {
                var sql = 'UPDATE `brand` SET `name`= "' + req.body[0].name + '",`description`= "' + req.body[0].description + '" WHERE id = ' + req.body[0].id;
                var message = 'Record updated successfully';
            }

            console.log(sql)
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Good!",
                        message: message
                    });
                }
            });
        });
    } else {
        res.send({
            success: true,
            type: "error",
            title: "Oops!",
            message: 'Invalid token.',
        });
    }
};

exports.ListBrands = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM brand WHERE companyid = ' + (req.decoded.logedinuser.companyid || 0), function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send(result)
                }
            });
        });
    }
};



exports.getBrandDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM brand WHERE id = ' + req.params.brandid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send(result)
                }
            });
        });
    }
};

exports.DeleteBrandDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('DELETE FROM brand WHERE id = ' + req.params.brandid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully'
                    });
                }
            });
        });
    }
};



exports.SaveProductDetails = function (req, res) {
    if (req.decoded.success == true) {
        if (req.file) {
            req.body.productDetails.imgfile = req.file ? req.file.filename : '';
        }
        if (req.body.productDetails.imgfile != '' || req.body.productDetails.imgfile != null) {
            req.body.productDetails.imgfile = req.body.productDetails.imgfile;
        }

        req.body.productDetails.createdby = req.decoded.logedinuser.id;
        req.body.productDetails.companyid = req.decoded.logedinuser.companyid;
        connection.acquire(function (err, con) {
            if (!req.body.productDetails.id) {
                con.query("INSERT INTO `product` set ?", req.body.productDetails, function (err, result) {
                    if (err) {
                        console.log("err 1")
                        console.log(err)
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
                            title: "Done!",
                            message: "Record inserted successfully."
                        });
                        con.release();
                    }
                });
            }
            if (req.body.productDetails.id) {
                con.query("UPDATE `product` set ? WHERE id = ?", [req.body.productDetails, req.body.productDetails.id], function (err, result) {
                    if (err) {
                        console.log("err 2")
                        console.log(err)
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
    }
};

exports.ListProducts = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT id,name,(SELECT `name` FROM `brand` WHERE `id` = product.brand) as brandname,mrp,slot FROM product WHERE companyid = ' + (req.decoded.logedinuser.companyid || 0), function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send(result)
                }
            });
        });
    }
};


exports.GetProductDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM `product` WHERE `id` = ' + req.params.productid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send(result)
                }
            });
        });
    }
};


exports.DeleteProductDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('DELETE FROM `product` WHERE `id` = ' + req.params.productid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
                }
            });
        });
    }
};

exports.SubmitOrder = function (req, res) {
    console.log(req.body);

    if(req.body[0].paidamount < req.body[0].netamount)
    {
        
    }

    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            if(req.body[0].customername.id)
            {
                con.query('INSERT INTO `ordermaster`(`cutomerid`, `paymentsts`, `paidamount`,`createdby`, `companyid`) VALUES (?,?,?,?,?)',[req.body[0].customername.id,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
                    if (err) {
                    }
                });
            }
            else
            {
            con.query('', function (err, result) {
                if (err) {
                }
            });
              }
        });
    }

};