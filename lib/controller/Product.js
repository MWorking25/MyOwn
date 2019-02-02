// Product.js
var connection = require('../Connection');
var fs = require('fs');
var pdf = require('html-pdf');
var http = require('http'),
    path = require('path');

function changeDateFormat(passeddate)
{
			
		var dd = new Date(passeddate).getDate();
		  if(dd < 10)
			  dd = '0'+dd;
		var mm = new Date(passeddate).getMonth() +1;
		if(mm < 10)
			mm = '0'+mm;
		var yy = new Date(passeddate).getFullYear();

		return  dd+'-'+mm+'-'+yy;
			
};

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
            con.query('SELECT id,name,(SELECT `name` FROM `brand` WHERE `id` = product.brand) as brandname,mrp,slot,imgfile FROM product WHERE companyid = ' + (req.decoded.logedinuser.companyid || 0), function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
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
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};


exports.DeleteProductDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            
			 con.query('SELECT (SELECT COUNT(*) FROM podetails WHERE podetails.productid = product.id) as pocounts,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.productid = product.id) as salecount FROM product WHERE product.id = ' + req.params.productid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
					if(result[0].pocounts > 0 || result[0].salecount > 0 )
					{
						 res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'You cannot delete this product, it`s exist in order details.'
                    });
					}
				else
				{
			con.query('DELETE FROM `product` WHERE `id` = ' + req.params.productid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
                    con.release();
                }
            });
				}
				}
			 });
        });
    }
};

exports.SubmitOrder = function (req, res) {

    if( 0 < req.body[0].paidamount < req.body[0].netamount)
    {
        var paymentsts = "Partialy Paid"
    }
    if(req.body[0].paidamount == req.body[0].netamount)
    {
        var paymentsts = "Full Paid"
    }
    if(req.body[0].paidamount <=  0)
    {
        var paymentsts = "Unpaid"
    }

    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            if(req.body[0].customername.id)
            {
                con.query('INSERT INTO `ordermaster`(`cutomerid`, `paymentsts`, `paidamount`,`netamount`,`createdby`, `companyid`) VALUES (?,?,?,?,?,?)',[req.body[0].customername.id,paymentsts,req.body[0].paidamount,req.body[0].netamount,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
                    if (err) {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: 'Somthing went wrong, Please try again.'
                        });
                        con.release();
                    }
                    else
                    {
                        var masterid = result.insertId;
                                    var ss = '';
                                    req.body.map(function(value){
                                            ss = ss+'('+masterid+','+value.id+','+value.mrp+','+value.qty+'),';
                                    });

                                    ss = ss.substring(0,ss.length -1)
                                    var sql = 'INSERT INTO `orderdetails`(`orderid`, `productid`, `mrp`, `qty`) VALUES ' +ss;

                                    con.query(sql, function (err, detailsresult) {
                                        if (err) {
                                            con.query('DELETE FROM ordermaster WHERE id = '+masterid, function (err, deleteresult) {
                                                if(err)
                                                {
                                                    res.send({
                                                        status: 1,
                                                        type: "error",
                                                        title: "Oops!",
                                                        message: 'Somthing went wrong, Please try again.'
                                                    });
                                                }
                                                else
                                                {
                                                    res.send({
                                                        status: 1,
                                                        type: "error",
                                                        title: "Oops!",
                                                        message: 'Somthing went wrong, Please try again.'
                                                    });
                                                }
                                            });

                                            con.release();
                                        }
                                        else
                                        {

                                            res.send({
                                                status: 0,
                                                type: "success",
                                                title: "Done!",
                                                message: 'Record inserted successfully.'
                                            });
                                            con.release();

                                        }
                                    });

                    }
                });
            }
            else
            {
            con.query('INSERT INTO `customermaster`(`name`, `mobile`, `email`, `address`, `createdby`, `companyid`) VALUES (?,?,?,?,?,?)',[req.body[0].customername,req.body[0].mobileno,req.body[0].email,req.body[0].address,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
                if (err) {
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                }
                else
                {
                        var customerid = result.insertId;
                        con.query('INSERT INTO `ordermaster`(`cutomerid`, `paymentsts`, `paidamount`,`netamount`,`createdby`, `companyid`) VALUES (?,?,?,?,?,?)',[customerid,paymentsts,req.body[0].paidamount,req.body[0].netamount,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
                            if (err) {
                                res.send({
                                    status: 1,
                                    type: "error",
                                    title: "Oops!",
                                    message: 'Somthing went wrong, Please try again.'
                                });
                                con.release();
                            }
                            else
                            {
                                var masterid = result.insertId;
                                    var ss = '';
                                    req.body.map(function(value){
                                            ss = ss+'('+masterid+','+value.id+','+value.mrp+','+value.qty+'),';
                                    });

                                    ss = ss.substring(0,ss.length -1)
                                    var sql = 'INSERT INTO `orderdetails`(`orderid`, `productid`, `mrp`, `qty`) VALUES ' +ss;

                                    con.query(sql, function (err, detailsresult) {
                                        if (err) {
                                            con.query('DELETE FROM ordermaster WHERE id = '+masterid, function (err, deleteresult) {
                                                if(err)
                                                {
                                                    res.send({
                                                        status: 1,
                                                        type: "error",
                                                        title: "Oops!",
                                                        message: 'Somthing went wrong, Please try again.'
                                                    });
                                                }
                                                else
                                                {
                                                    res.send({
                                                        status: 1,
                                                        type: "error",
                                                        title: "Oops!",
                                                        message: 'Somthing went wrong, Please try again.'
                                                    });
                                                }
                                            });

                                            con.release();
                                        }
                                        else
                                        {

                                            res.send({
                                                status: 0,
                                                type: "success",
                                                title: "Done!",
                                                message: 'Record inserted successfully.'
                                            });
                                            con.release();

                                        }
                                    });

                            }
                        });
                }
            });
              }
        });
    }

};


//CUSTOMERS

exports.ListCustomers = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT `id`,`name`,`mobile`,`email` FROM `customermaster` WHERE`companyid` = ' + (req.decoded.logedinuser.companyid || 0), function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};

exports.SaveCustomerDetails = function(req,res)
{
    if (req.decoded.success == true) {
		
		if(!req.body[0].id)
		{
			req.body[0].createdby = req.decoded.logedinuser.id;
			req.body[0].companyid = req.decoded.logedinuser.companyid;
			
			var sql = "INSERT INTO customermaster set ?";
			var obj = req.body[0]
			var message = "Record inserted successfully";
		}
		if(req.body[0].id)
		{
		var sql = "UPDATE customermaster set ? WHERE id = ?";	
		var obj = [req.body[0],req.body[0].id];
		var message = "Record updated successfully";
		}
		
        connection.acquire(function (err, con) {
            con.query(sql,obj, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: message
                    });
                    con.release();
                }
            });
        });
    }
};

exports.GetCustomerDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM `customermaster` WHERE `id` = ' + req.params.customerid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};


exports.DeleteCustomerDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT COUNT(*) as totoalorder FROM `ordermaster` WHERE ordermaster.cutomerid = ' + req.params.customerid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
					if(result[0].totoalorder > 0)
					{
						 res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'This customer exist in orders, you cannot delete it.'
                    });
					}
					else
					{
						 con.query('DELETE FROM `customermaster` WHERE `id` = ' + req.params.customerid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					} 
					else {
						  res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
					}
					});					
					}
                    con.release(); 
                }
            });
        });
    }
};


//INQUIRIES

exports.ListInquiries = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM `inquiries` WHERE `companyid` = ' + (req.decoded.logedinuser.companyid || 0), function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};

exports.SaveInquiryDetails = function(req,res)
{
    if (req.decoded.success == true) {
		
		if(!req.body[0].id)
		{
			req.body[0].createdby = req.decoded.logedinuser.id;
			req.body[0].companyid = req.decoded.logedinuser.companyid;
			
			var sql = "INSERT INTO inquiries set ?";
			var obj = req.body[0]
			var message = "Record inserted successfully";
		}
		if(req.body[0].id)
		{
		var sql = "UPDATE inquiries set ? WHERE id = ?";	
		var obj = [req.body[0],req.body[0].id];
		var message = "Record updated successfully";
		}
		
        connection.acquire(function (err, con) {
            con.query(sql,obj, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: message
                    });
                    con.release();
                }
            });
        });
    }
};

exports.GetInquiryDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM `inquiries` WHERE `id` = ' + req.params.inquiryid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};


exports.DeleteInquiryDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            
						 con.query('DELETE FROM `inquiries` WHERE `id` = ' + req.params.inquiryid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					 con.release(); 
					} 
					else {
						  res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
					 con.release(); 
					}
					});					
        });
    }
};




//SALES

exports.GetSaleListOninterval = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
			
			if(req.params.interval === 'Week')
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE()) ';
			}
			if(req.params.interval === 'Month')
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y") ';
			}	
			
			if(req.params.interval === 'Year')
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND YEAR(ordermaster.createddate) = YEAR(CURDATE()) ';
			}			
			if(req.params.interval === 'Today')
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y") ';
			}
		
		//(CASE WHEN ordermaster.cutomerid != 0 THEN (SELECT customermaster.name FROM customermaster WHERE customermaster.id = ordermaster.cutomerid) ELSE "" END) as customername,
           con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};

exports.GetsaleListOndates = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
			
			if(req.params.fromdate != 'undefined')
				var fromdate = changeDateFormat(req.params.fromdate);
			if(req.params.todate != 'undefined')
				var todate = changeDateFormat(req.params.todate) 
			
			 if(todate == undefined && fromdate != undefined)
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = "'+fromdate+'" ';
			}
			
			if(todate != undefined && fromdate != undefined)
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND (DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") BETWEEN "'+fromdate+'" AND "'+todate+'" )';
			}			
			if(fromdate == undefined)
			{
				var sql = 'SELECT ordermaster.id as masterid,(SELECT COUNT(*) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as skus,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0) as totalqty,ordermaster.createddate,(SELECT user.name FROM user WHERE user.id = ordermaster.createdby) as createduser,ordermaster.paymentsts,ordermaster.paidamount FROM ordermaster WHERE ordermaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y") ';
			}
		
		//(CASE WHEN ordermaster.cutomerid != 0 THEN (SELECT customermaster.name FROM customermaster WHERE customermaster.id = ordermaster.cutomerid) ELSE "" END) as customername,
           con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};


exports.GetSalesDetails = function(req,res)
{
	 if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
		con.query('SELECT orderdetails.id as detailid,ordermaster.id as masterid,DATE_FORMAT(ordermaster.createddate,"%d/%m/%Y") as orderdate,(CASE WHEN ordermaster.cutomerid != 0 THEN (SELECT customermaster.name FROM customermaster WHERE customermaster.id = ordermaster.cutomerid) ELSE "General order" END) as customer,FORMAT(orderdetails.mrp,2) AS mrp,orderdetails.qty,orderdetails.productid,(SELECT CONCAT(product.name," - ",(SELECT brand.name FROM brand WHERE brand.id = product.brand)) FROM product WHERE product.id = orderdetails.productid) as productname,FORMAT(IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0),2) as netamount FROM orderdetails INNER JOIN `ordermaster` ON ordermaster.id = orderdetails.orderid  WHERE ordermaster.id ='+req.params.saleid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					} 
					else {
						  res.send(result);
					}
					});	
				con.release();	
		});
	 }		
};

exports.DeleteSalesDetails = function(req,res)
{
	 if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
		con.query('DELETE FROM `orderdetails` WHERE `orderid` = ?;DELETE FROM `ordermaster` WHERE `id` =  ?' ,[req.params.saleid,req.params.saleid], function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					} 
					else {
						  res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
					}
					});	
				con.release();	
		});
	 }		
};

exports.RemoveSaledProduct = function(req,res)
{
	 if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
		con.query('DELETE FROM `orderdetails` WHERE `id` = ?' ,[req.params.saledetailsid], function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					} 
					else {
						  res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
					}
					});	
				con.release();	
		});
	 }		
};

exports.UpdateSaleOrder = function(req,res)
{
	 if (req.decoded.success == true) {

        var orderdetails = req.body

        connection.acquire(function (err, con) {
                    console.log(orderdetails);
                     if( 0 < req.body[0].paidamount < req.body[0].newnetamount)
                        {
                            var paymentsts = "Partialy Paid"
                        }
                        if(req.body[0].paidamount == req.body[0].newnetamount)
                        {
                            var paymentsts = "Full Paid"
                        }
                        if(req.body[0].paidamount <=  0)
                        {
                            var paymentsts = "Unpaid"
                        }
                        console.log(paymentsts);

            var sql = 'UPDATE ordermaster SET ordermaster.paymentsts = "'+paymentsts+'", ordermaster.paidamount = '+req.body[0].paidamount+',netamount = '+ req.body[0].newnetamount+' WHERE ordermaster.id = '+orderdetails[0].masterid+';';
            

            orderdetails.forEach(function(value)
            {
                if(value.detailid)
                {
                    if(value.productname.id)
                    {
                        var productid = value.productname.id;
                    }
                    if(!value.productname.id)
                    {
                        var productid = value.productid;
                    }
                    sql += 'UPDATE orderdetails SET `productid` = '+productid+',`mrp` = '+value.mrp+',`qty` = '+value.qty+' WHERE `id` = '+value.detailid+';'
                }
                if(!value.detailid)
                sql += 'INSERT INTO `orderdetails`(`orderid`, `productid`, `mrp`, `qty`) VALUES ('+orderdetails[0].masterid+','+value.productname.id+','+value.mrp+','+value.qty+');'
            });


            console.log(sql);

		con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					} 
					else {
						  res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
					}
					});	
				con.release();	
		});
	 }		
};

//DASHBOARD

exports.GetDashboardCount = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
			
			if(req.params.interval === 'Week')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = id AND WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE())),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND WEEKOFYEAR(pomaster.createddate) = WEEKOFYEAR(CURDATE())),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
			}
			if(req.params.interval === 'Month')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = id AND MONTH(ordermaster.createddate) = MONTH(CURDATE()) AND YEAR(ordermaster.createddate) = YEAR(CURDATE())),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND MONTH(pomaster.createddate) = MONTH(CURDATE()) AND YEAR(pomaster.createddate) = YEAR(CURDATE())),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
			}	
			if(req.params.interval === 'Year')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = id AND YEAR(ordermaster.createddate) = YEAR(CURDATE())),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND YEAR(pomaster.createddate) = YEAR(CURDATE())),0) AS totalpoamt FROM companymaster WHERE `id`=' + (req.decoded.logedinuser.companyid || 0)
			}			
			if(req.params.interval === 'Today')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = id AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y")),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y")),0) AS totalpoamt FROM companymaster WHERE `id`=' + (req.decoded.logedinuser.companyid || 0)
			}
		
			
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};


exports.GetDashboardCountOndates = function(req,res)
{
	  if (req.decoded.success == true) {
		
			if(req.params.fromdate != 'undefined')
				var fromdate = changeDateFormat(req.params.fromdate);
			if(req.params.todate != 'undefined')
				var todate = changeDateFormat(req.params.todate) 

		  if(todate == undefined && fromdate != undefined)
		  {			  
			  var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = companymaster.id AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = "'+fromdate+'"),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = "'+fromdate+'"),0) AS totalpoamt FROM companymaster WHERE `id`=' + (req.decoded.logedinuser.companyid || 0)
		  }
		  if(fromdate == undefined)
		  {
			  var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = companymaster.id AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y")),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y")),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
		  }
		  if(todate != undefined && fromdate != undefined)
		  {
			  var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(ordermaster.netamount) FROM ordermaster WHERE ordermaster.companyid = companymaster.id AND (DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") BETWEEN "'+fromdate+'" AND "'+todate+'")),0) AS totalorderamt,(SELECT COUNT(*) FROM customermaster WHERE customermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(pomaster.netamount) FROM pomaster WHERE pomaster.companyid = companymaster.id AND (DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") BETWEEN "'+fromdate+'" AND "'+todate+'")),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
		  }
         connection.acquire(function (err, con) {
			 con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
		}); 
	  }
};

exports.getTopsaledProducts = function(req,res)
{
	  if (req.decoded.success == true) {
		
		
		 connection.acquire(function (err, con) {
			 con.query('SELECT product.id,product.name as category,IFNULL((SELECT (SUM(orderdetails.qty) / 1000 * 100) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+')),0) as value,100 as full FROM product ORDER BY value DESC LIMIT 10', function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
		}); 
		
	  }
};


exports.getTimewaiseSale = function(req,res)
{
	  if (req.decoded.success == true) {
		
		if(req.params.interval === 'Today')
		var sql = 'SELECT hr AS `hours`, MAX(OrdersAmount) AS `OrdersAmount`, MAX(Paidamount) AS `Paidamount` FROM (SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr, FORMAT(SUM(ordermaster.netamount),2) AS OrdersAmount, FORMAT(0,2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y") GROUP BY TIME_FORMAT(ordermaster.createddate,"%h") UNION SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr ,FORMAT(0,2) AS OrdersAmount, FORMAT(SUM(ordermaster.paidamount),2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y") GROUP BY TIME_FORMAT(ordermaster.createddate,"%h")) AS derivedtable GROUP BY hr ORDER BY hr';
	
		if(req.params.interval === 'Month')
		var sql = 'SELECT hr AS `hours`, MAX(OrdersAmount) AS `OrdersAmount`, MAX(Paidamount) AS `Paidamount` FROM (SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr, FORMAT(SUM(ordermaster.netamount),2) AS OrdersAmount, FORMAT(0,2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y") GROUP BY TIME_FORMAT(ordermaster.createddate,"%h") UNION SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr ,FORMAT(0,2) AS OrdersAmount, FORMAT(SUM(ordermaster.paidamount),2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(ordermaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y") GROUP BY TIME_FORMAT(ordermaster.createddate,"%h")) AS derivedtable GROUP BY hr ORDER BY hr'
		
		
		if(req.params.interval === 'Week')
		var sql = 'SELECT hr AS `hours`, MAX(OrdersAmount) AS `OrdersAmount`, MAX(Paidamount) AS `Paidamount` FROM (SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr, FORMAT(SUM(ordermaster.netamount),2) AS OrdersAmount, FORMAT(0,2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE()) GROUP BY TIME_FORMAT(ordermaster.createddate,"%h") UNION SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr ,FORMAT(0,2) AS OrdersAmount, FORMAT(SUM(ordermaster.paidamount),2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE()) GROUP BY TIME_FORMAT(ordermaster.createddate,"%h")) AS derivedtable GROUP BY hr ORDER BY hr'
	
		if(req.params.interval === 'Year')
		var sql = 'SELECT hr AS `hours`, MAX(OrdersAmount) AS `OrdersAmount`, MAX(Paidamount) AS `Paidamount` FROM (SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr, FORMAT(SUM(ordermaster.netamount),2) AS OrdersAmount, FORMAT(0,2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND YEAR(ordermaster.createddate) = YEAR(CURDATE()) GROUP BY TIME_FORMAT(ordermaster.createddate,"%h") UNION SELECT TIME_FORMAT(ordermaster.createddate,"%h") AS hr ,FORMAT(0,2) AS OrdersAmount, FORMAT(SUM(ordermaster.paidamount),2) AS Paidamount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' AND YEAR(ordermaster.createddate) = YEAR(CURDATE()) GROUP BY TIME_FORMAT(ordermaster.createddate,"%h")) AS derivedtable GROUP BY hr ORDER BY hr'
		
		 connection.acquire(function (err, con) {
			 con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
		}); 
		
	  }
};

exports.getMonthlysaleNPurchase = function(req,res)
{
	  if (req.decoded.success == true) {
				 connection.acquire(function (err, con) {
			 con.query('SELECT yr AS `Year`, mnth AS `Month`, MAX(OrdersAmount) AS `OrdersAmount`, MAX(PoAmount) AS `PoAmount` FROM (SELECT YEAR(ordermaster.createddate) AS yr, MONTHNAME(ordermaster.createddate) AS mnth, SUM(ordermaster.netamount) AS OrdersAmount, 0 AS PoAmount FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' GROUP BY YEAR(ordermaster.createddate), MONTH(ordermaster.createddate) UNION SELECT YEAR(pomaster.createddate) AS yr, MONTHNAME(pomaster.createddate) AS mnth, 0 AS OrdersAmount, SUM(pomaster.netamount) AS PoAmount FROM pomaster WHERE pomaster.companyid = '+(req.decoded.logedinuser.companyid || 0)+' GROUP BY YEAR(pomaster.createddate), MONTH(pomaster.createddate)) AS derivedtable GROUP BY yr, mnth ORDER BY yr, mnth', function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                   
				    res.send(result);
                    con.release();
				   
                }
            });
		}); 
		
	  }
};




//VENDOR


exports.ListVendors = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT `id`,`name`,`email`,`mobile1`,`mobile2`,(SELECT user.name FROM user WHERE user.id = vendors.createdby) as createduser FROM `vendors` WHERE `companyid` = '+(req.decoded.logedinuser.companyid || 0), function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                        res.send(result);
                        con.release();
                }
            });
        });
    }
    else {
        res.send({
            success: true,
            type: "error",
            title: "Oops!",
            message: 'Invalid token.',
        });
        
    }
};

exports.GetVendorDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM `vendors` WHERE `id` = '+req.params.vendorid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                        res.send(result);
                        con.release();
                }
            });
        });
    }
    else {
        res.send({
            success: true,
            type: "error",
            title: "Oops!",
            message: 'Invalid token.',
        });
        
    }
};






exports.DeleteVendorDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT id,(SELECT COUNT(*) FROM pomaster WHERE pomaster.vendor = vendors.id) as pocnts FROM `vendors` WHERE id = '+req.params.vendorid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
					if(result[0].pocnts > 0)
					{
						 res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'This vendor exist in orders, you cannot delete it.'
                    });
					}
					else
					{
						 con.query('DELETE FROM `vendors` WHERE `id` = ' + req.params.vendorid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
					} 
					else {
						  res.send({
                        status: 0,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully.'
                    });
					}
					});					
					}
                    con.release(); 
                }
            });
        });
    }
};


exports.SaveVendorsDetails = function (req, res) {
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {

            if (!req.body[0].id) {
                var sql = 'INSERT INTO `vendors` (`name`, `address`, `email`, `mobile1`, `mobile2`, `createdby`, `companyid`, `gstin`)VALUES ("' + req.body[0].name + '","' + req.body[0].address + '","'+req.body[0].email+'",'+ req.body[0].mobile1 + ','+ (req.body[0].mobile2 || null) + ',' + req.decoded.logedinuser.id + ',' + (req.decoded.logedinuser.companyid || 0) + ',"'+(req.body[0].gstin || '')+'")';
                var message = 'New Record inserted successfully';
            }

            if (req.body[0].id) {
                var sql = 'UPDATE `vendors` SET `name`="'+req.body[0].name +'",`address`="'+req.body[0].address +'",`email`="'+req.body[0].email+'",`mobile1`='+req.body[0].mobile1+',`mobile2`='+req.body[0].mobile2+',`gstin`="'+req.body[0].gstin+'" WHERE id = ' + req.body[0].id;
                var message = 'Record updated successfully';
            }

            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send({
                        status: 0,
                        type: "success",
                        title: "Good!",
                        message: message
                    });
                    con.release();
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
        con.release();
    }
};


exports.ValidateEmailForVendor = function(req,res)
{
	  if (req.decoded.success == true) {
        
            if(req.params.vendorid != 'undefined')
            {
                var sql =  "SELECT * FROM `vendors` WHERE `email` = '"+req.params.email+"' AND id != "+req.params.vendorid+"";
            }
            else
            {
              var sql =  "SELECT * FROM `vendors` WHERE `email` = '"+req.params.email+"'";
            }
		
		 connection.acquire(function (err, con) {
			 con.query(sql,function (err, result) {
                if (err) {
                    res.send({
                        status: 0,
                        type: "error",
                        title: "Oops!",
                        message: "Something went wrong."
                    });
                    con.release();
                } else {
                    if (result.length > 0) {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Email id already exist"
                        });
                        con.release();
                    } else {
                        res.send({
                            status: 2,
                            type: "success",
                            title: "Ok!",
                            message: ""
                        });
                        con.release();
                    }
                }
            });
		}); 
		
	  }
};


// purchase


exports.savePoOrder = function (req, res) {
    if (req.decoded.success == true) {

         console.log(req.body);

        connection.acquire(function (err, con) {
            if(req.body[0].masterid)
            {
                    var sql = 'UPDATE `pomaster` SET `vendor`='+parseInt(req.body[0].vendorid)+',`cgst`='+req.body[0].cgst+',`sgst`='+req.body[0].sgst+',`igst`='+req.body[0].igst+',`grossamount`='+req.body[0].grossamount+',`taxamount`= '+req.body[0].taxamount+',`netamount`= '+req.body[0].netamount+' WHERE `id`= '+req.body[0].masterid+';';

                            req.body.filter((value)=>
                            {
                                 return value.masterid
                            }).map((value)=>{
                                
                                if(value.productname.id)
                                {
                                    var productid = value.productname.id;
                                }
                                else
                                {
                                    var productid = value.productid;
                                }
                                sql+= 'UPDATE `podetails` SET `productid`= '+productid +',`qty`= '+value.qty+',`porate`='+value.porate+' WHERE id = '+value.detailsid+';';
                            });
                        
                            req.body.filter((value)=>
                            {
                               return  !value.masterid
                            }).map((value)=>{
                                sql+= 'INSERT INTO `podetails`(`poid`, `productid`, `qty`, `porate`) VALUES ('+req.body[0].masterid+','+value.productname.id+','+value.qty+','+value.porate+');';
                            });

                            con.query(sql, function (err,result) {
                                if (err) {
                                    console.log(err)
                                    res.send({
                                        status: 1,
                                        type: "error",
                                        title: "Oops!",
                                        message: 'Somthing went wrong, Please try again.'
                                    });
                                    con.release();
                                } else {
                                    res.send({
                                        status: 0,
                                        type: "success",
                                        title: "Good!",
                                        message: 'Record updated successfully.'
                                    });
                                    con.release();
                                }
                            });
            }
            else
            {
            con.query('INSERT INTO `pomaster`(`vendor`,`netamount`,`createdby`, `companyid`) VALUES (?,?,?,?)',[req.body[0].vendorid,req.body[0].netamount,req.decoded.logedinuser.id,(req.decoded.logedinuser.companyid || 0)], function (err, msterresult) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                            var masterid = msterresult.insertId;
                            var ss = '';
                            req.body.map((value)=>{
                                ss += '('+masterid+','+value.productname.id+','+value.qty+','+value.porate+'),'
                            });
                            ss = ss.substring(0,ss.length -1);
                    con.query('INSERT INTO `podetails`(`poid`, `productid`, `qty`,`porate`) VALUES '+ss, function (err, result) {
                        if (err) {
                            console.log(err)
                            con.query('DELETE FROM `pomaster` WHERE `id` = ' + masterid, function (err, result) {
                                if (err) {
                                    console.log(err)
                                    res.send({
                                        status: 1,
                                        type: "error",
                                        title: "Oops!",
                                        message: 'Somthing went wrong, Please try again.'
                                    });
                                    con.release();
                                    } 
                                    else {
                                          res.send({
                                            status: 1,
                                            type: "error",
                                            title: "Oops!",
                                            message: 'Somthing went wrong, Please try again.'
                                    });
                                    con.release();
                                }
                            });
                        }
                         else {
                            
                            res.send({
                                status: 0,
                                type: "success",
                                title: "Good!",
                                message: 'New Record inserted successfully.'
                            });
                            con.release();
                        }
                    });
                }
            });
        }
        });
    
    } else {
        res.send({
            success: true,
            type: "error",
            title: "Oops!",
            message: 'Invalid token.',
        });
        con.release();
    }
};



exports.GetPurchaseDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('SELECT pomaster.id AS masterid,podetails.productid,pomaster.vendor as vendorid,(SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,pomaster.cgst,pomaster.sgst,pomaster.igst,pomaster.grossamount,pomaster.taxamount,pomaster.netamount,podetails.id as detailsid,podetails.qty,podetails.porate,(SELECT product.name FROM product WHERE product.id = podetails.productid) as productname FROM podetails INNER JOIN pomaster ON pomaster.id = podetails.poid WHERE pomaster.id = '+req.params.poid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
    else {
        res.send({
            success: true,
            type: "error",
            title: "Oops!",
            message: 'Invalid token.',
        });
        con.release();
    }
};

exports.DeletePurchaseDetails = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            con.query('DELETE FROM `podetails` WHERE podetails.poid = '+req.params.poid+';DELETE FROM pomaster WHERE  pomaster.id = '+req.params.poid+';', function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send({
                        status: 1,
                        type: "success",
                        title: "Done!",
                        message: 'Record deleted successfully'
                    });
                    con.release();
                }
            });
        });
    }
    else {
        res.send({
            success: true,
            type: "error",
            title: "Oops!",
            message: 'Invalid token.',
        });
        con.release();
    }
};



exports.GetPurchaseListOninterval = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
			
			if(req.params.interval === 'Week')
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND WEEKOFYEAR(pomaster.createddate) = WEEKOFYEAR(CURDATE()) ';
			}
			if(req.params.interval === 'Month')
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(pomaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y") ';
			}	
			
			if(req.params.interval === 'Year')
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND YEAR(pomaster.createddate) = YEAR(CURDATE()) ';
			}			
			if(req.params.interval === 'Today')
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y") ';
			}
	
           con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};

exports.GetPurchaseListOndates = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
			
			if(req.params.fromdate != 'undefined')
				var fromdate = changeDateFormat(req.params.fromdate);
			if(req.params.todate != 'undefined')
				var todate = changeDateFormat(req.params.todate) 
			
			 if(todate == undefined && fromdate != undefined)
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = "'+fromdate+'" ';
			}
			
			if(todate != undefined && fromdate != undefined)
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND (DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") BETWEEN "'+fromdate+'" AND "'+todate+'" )';
			}			
			if(fromdate == undefined)
			{
				var sql = 'SELECT `id`,`netamount`,`createddate`, (SELECT vendors.name FROM vendors WHERE vendors.id = pomaster.vendor) as vendorname,(SELECT COUNT(*) FROM podetails WHERE podetails.poid = pomaster.id) as totalskus,(SELECT user.name FROM user WHERE user.id = pomaster.createdby) as createduser FROM `pomaster` WHERE pomaster.companyid = '+ (req.decoded.logedinuser.companyid || 0)+' AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y") ';
			}

           con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
        });
    }
};





// pdf generation


exports.GenerateInvoiceCopy = function(req,res)
{
	  if (req.decoded.success == true) {
		
		  connection.acquire(function (err, con) {
			 con.query('SELECT companymaster.name as companyname,CONCAT(companymaster.address_ln1,", ",companymaster.address_ln2) as companyaddress,CONCAT(companymaster.mobile1,"",(CASE WHEN companymaster.mobile2 != 0 THEN CONCAT("/ ", companymaster.mobile2) ELSE "" END)) AS companycontact,companymaster.email,companymaster.website,companymaster.logo,companymaster.gstin,0 as gst,ordermaster.id as masterid,DATE_FORMAT(ordermaster.createddate,"%d/%m/%Y") as orderdate,(CASE WHEN ordermaster.cutomerid != 0 THEN (SELECT customermaster.name FROM customermaster WHERE customermaster.id = ordermaster.cutomerid) ELSE "General order" END) as customer,FORMAT(orderdetails.mrp,2) AS mrp,orderdetails.qty,(SELECT CONCAT(product.name," - ",(SELECT brand.name FROM brand WHERE brand.id = product.brand)) FROM product WHERE product.id = orderdetails.productid) as productname,FORMAT(IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id),0),2) as netamount FROM orderdetails INNER JOIN `ordermaster` ON ordermaster.id = orderdetails.orderid INNER JOIN companymaster ON companymaster.id = ordermaster.companyid  WHERE ordermaster.id ='+req.params.oriderid, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    //res.send(result);
					var filewriteerror = 0;
					var template = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script> </head><body><div class="container mt-4 mb-4"><div style="width:784px;height:980px;padding: 10px;"><div class=" row text-center" id="pageHeader" style="margin:auto;position:relative;right:8%;"><div style="position:absolute;top:-30px;left:100px;"><img src="http://localhost:8082/uploads/'+result[0].logo+'" class="img-responsive" style="height:150px;width:150px;"/></div><div class="col-md-12 col-12 text-center"><h1 style="position:relative;top:-10px">'+result[0].companyname+'</h1><div class="row"  style="position:relative;right:-210px;width:570px;top:-20px"><p>'+result[0].companyaddress+'</p> </div> <div class="row"><span style="position:relative;right:200px;top:-35px"><b>Bill No.: '+result[0].masterid+'</b></span> <span style="position:relative;right:-140px;top:-35px"><b>GSTIN: '+result[0].gstin+'</b></span></div> </div> </div><div class="col-md-12"><table class="table table-bordered"><tr><td colspan="3"><div class="row"><div class="col-md-12 text-left"><b>Order From: '+result[0].customer+'</b></div></div></td><td colspan="2"><div class="row"><div class="col-md-6 text-right"><b>Invoice Date: '+result[0].orderdate+'</b></div></div></td></tr><tr><th>Sr.No.</th><th>Item</th><th>Qty.</th><th>Unit Price</th><th>Net Price</th></tr><tbody>';
					
					result.forEach(function(item,index){
					  template += '<tr> <td>'+(index +1)+'</td><td>'+item.productname+'</td><td>'+item.qty+'</td><td class="text-right">'+item.mrp+'</td><td class="text-right">'+(item.mrp * item.qty).toFixed(2)+'</td></tr>';
					});
					
					
					template += '<tr class="mt-2"><td colspan="3"><div class="col-12 col-md-12"><b>Gross Amount:</b></div></td><td colspan="2"><div class="col-12 col-md-12 text-right"><b>'+result[0].netamount+'</b></div></td></tr><tr><td colspan="3"><div class="col-12 col-md-12"><b>GST:</b></div><div class="col-12 col-md-12"><p>cgst('+result[0].gst / 2+'%): '+(result[0].netamount * ((result[0].gst / 2)/100)).toFixed(2)+' &nbsp;&nbsp; sgst('+result[0].gst / 2+'%): '+(result[0].netamount * ((result[0].gst / 2)/100)).toFixed(2)+'</p></div></td><td colspan="2"><div class="col-12 col-md-12 text-right"><b>'+(result[0].netamount * (result[0].gst/100)).toFixed(2)+'</b></div></td></tr><tr><td colspan="3"><div class="col-12 col-md-12"><b>Net Amount:</b><div class="col-12 col-md-12"><p>Gross Amount + GST</p></div></div></td><td colspan="2"><div class="col-12 col-md-12 text-right"><b>'+(parseFloat(result[0].netamount) + parseFloat(result[0].netamount * (result[0].gst/100))).toFixed(2)+'</b></div></td></tr><tr><td colspan="3"><div class="col-12 col-md-12 text-center"><b>Received By</b></div><div class="col-12 col-md-12 text-center mt-4 pt-4 pb-4"></div></td><td colspan="2" rowspan="2"><div class="col-12 col-md-12 text-center"><b>Authorise Signature</b></div><div class="col-12 col-md-12 text-center mt-4 pt-4 pb-4"></div></td></tr></tbody></table></div></div></div><div id="pageFooter"><div class="row"  style="position:relative;top:20px;right:-250px;"><span>'+result[0].companycontact+'</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>'+result[0].email+'</span><br><span style="position:relative;top:2px;right:-100px;">'+result[0].website+'</span></div> </div></body></html>'
					
					fs.writeFile('./Templtes/invoice.html', template, function(err, data){
						if (err){
							 filewriteerror = 1
						}
						else
						{
							var html = fs.readFileSync('./Templtes/invoice.html', 'utf8');
								var options = { format: 'Letter'};
								pdf.create(html, options).toFile('./www/pdf/Invoivce_for_order_'+result[0].masterid+'.pdf', function(err, res) {
								  if (err){
									 filewriteerror = 1;
								  }
										else
										{
											console.log(res); // { filename: '/app/businesscard.pdf' }
											
											
										}
								});	
						}
					});
					/* var file = fs.createReadStream('./pdf/Invoivce_for_order_'+result[0].masterid+'.pdf');
											var stat = fs.statSync('./pdf/Invoivce_for_order_'+result[0].masterid+'.pdf');
											res.setHeader('Content-Length', stat.size);
											res.setHeader('Content-Type', 'application/pdf');
											res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
											res.setHeader('status', '0');
											file.pipe(res); */
											
											if(filewriteerror == 1)
											{
												res.send({
											status: 1,
											type: "error",
											title: "Oops!",
											message: 'Somthing went wrong, Please try again.'
										});
										con.release();
											}
										else
										{
											 res.send({
													status: 0,
													type: "success",
													title: "Done!",
													message: 'Invoice copy generated successfully',
													filename:'Invoivce_for_order_'+result[0].masterid+'.pdf'
												}); 
												con.release();
											
											
										}
											
											 
                }
            });
		}); 
		 
	  }
};

exports.getInventoryOnInterval = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            
            if(req.params.interval == 'Today')
            {
                var sql = 'SELECT product.name,product.id,product.mrp,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0) as qtyissued,IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0) as qtyrcvd,IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") < DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") < DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0),0) AS openingbal,((IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") < DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") < DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0),0) + IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0)) AS closingbal FROM product ORDER BY id DESC';
            }
             
            if(req.params.interval == 'Week')
            {
                var sql = 'SELECT product.name,product.id,product.mrp,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE()))),0) as qtyissued,IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE WEEKOFYEAR(pomaster.createddate) = WEEKOFYEAR(CURDATE()))),0) as qtyrcvd,IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE WEEKOFYEAR(pomaster.createddate) < WEEKOFYEAR(CURDATE()))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  WEEKOFYEAR(ordermaster.createddate) < WEEKOFYEAR(CURDATE()))),0),0) AS openingbal,((IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE WEEKOFYEAR(pomaster.createddate) < WEEKOFYEAR(CURDATE()))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  WEEKOFYEAR(ordermaster.createddate) < WEEKOFYEAR(CURDATE()))),0),0) + IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE WEEKOFYEAR(pomaster.createddate) = WEEKOFYEAR(CURDATE()))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE()))),0)) AS closingbal FROM product ORDER BY id DESC';
            }
               

            if(req.params.interval == 'Month')
            {
                var sql = 'SELECT product.name,product.id,product.mrp,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y"))),0) as qtyissued,IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y"))),0) as qtyrcvd,IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%m-%Y") < DATE_FORMAT(CURDATE(),"%m-%Y"))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%m-%Y") < DATE_FORMAT(CURDATE(),"%m-%Y"))),0),0) AS openingbal,((IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%m-%Y") < DATE_FORMAT(CURDATE(),"%m-%Y"))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%m-%Y") < DATE_FORMAT(CURDATE(),"%m-%Y"))),0),0) + IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y"))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%m-%Y") = DATE_FORMAT(CURDATE(),"%m-%Y"))),0)) AS closingbal FROM product ORDER BY id DESC';
            }

            if(req.params.interval == 'Year')
            {
                var sql = 'SELECT product.name,product.id,product.mrp,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  YEAR(ordermaster.createddate) = YEAR(CURDATE()))),0) as qtyissued,IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE YEAR(pomaster.createddate) = YEAR(CURDATE()))),0) as qtyrcvd,IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE YEAR(pomaster.createddate) < YEAR(CURDATE()))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  YEAR(ordermaster.createddate) < YEAR(CURDATE()))),0),0) AS openingbal,((IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE YEAR(pomaster.createddate) < YEAR(CURDATE()))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  YEAR(ordermaster.createddate) < YEAR(CURDATE()))),0),0) + IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE YEAR(pomaster.createddate) = YEAR(CURDATE()))),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  YEAR(ordermaster.createddate) = YEAR(CURDATE()))),0)) AS closingbal FROM product ORDER BY id DESC';
            }
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
    
        });
}
else {
    res.send({
        success: true,
        type: "error",
        title: "Oops!",
        message: 'Invalid token.',
    });
    con.release();
}
};



exports.getInventoryOnDates = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            
            console.log(req.params)

            if(req.params.todate == 'undefined')
            {
                var sql = 'SELECT product.name,product.id,product.mrp,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = "'+req.params.fromdate+'")),0) as qtyissued,IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = "'+req.params.fromdate+'")),0) as qtyrcvd,IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0),0) AS openingbal,((IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0),0) + IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = "'+req.params.fromdate+'")),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = "'+req.params.fromdate+'")),0)) AS closingbal FROM product ORDER BY id DESC';
            }
             else
             {
                 var sql = 'SELECT product.name,product.id,product.mrp,IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") BETWEEN "'+req.params.fromdate+'" AND "'+req.params.todate+'")),0) as qtyissued,IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") BETWEEN "'+req.params.fromdate+'" AND "'+req.params.todate+'")),0) as qtyrcvd,IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = "'+req.params.todate+'")),0),0) AS openingbal,((IFNULL((IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") < "'+req.params.fromdate+'")),0),0) + IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.productid = product.id AND podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") BETWEEN "'+req.params.fromdate+'" AND "'+req.params.todate+'")),0)) - IFNULL((SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.productid = product.id AND orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE  DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") BETWEEN "'+req.params.fromdate+'" AND "'+req.params.todate+'")),0)) AS closingbal FROM product ORDER BY id DESC';
             }
          
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: 1,
                        type: "error",
                        title: "Oops!",
                        message: 'Somthing went wrong, Please try again.'
                    });
                    con.release();
                } else {
                    res.send(result);
                    con.release();
                }
            });
    
        });
}
else {
    res.send({
        success: true,
        type: "error",
        title: "Oops!",
        message: 'Invalid token.',
    });
    con.release();
}
};
