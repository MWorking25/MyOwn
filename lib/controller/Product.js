// Product.js
var connection = require('../Connection');


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
			 });
        });
    }
};

exports.SubmitOrder = function (req, res) {
    console.log(req.body);

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

    console.log(paymentsts);
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
            if(req.body[0].customername.id)
            {
                con.query('INSERT INTO `ordermaster`(`cutomerid`, `paymentsts`, `paidamount`,`createdby`, `companyid`) VALUES (?,?,?,?,?)',[req.body[0].customername.id,paymentsts,req.body[0].paidamount,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
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
            con.query('INSERT INTO `cutomermaster`(`name`, `mobile`, `email`, `address`, `createdby`, `companyid`) VALUES (?,?,?,?,?,?)',[req.body[0].customername,req.body[0].mobileno,req.body[0].email,req.body[0].address,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
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
                        con.query('INSERT INTO `ordermaster`(`cutomerid`, `paymentsts`, `paidamount`,`createdby`, `companyid`) VALUES (?,?,?,?,?)',[customerid,paymentsts,req.body[0].paidamount,req.decoded.logedinuser.id,req.decoded.logedinuser.companyid], function (err, result) {
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
            con.query('SELECT `id`,`name`,`mobile`,`email` FROM `cutomermaster` WHERE`companyid` = ' + (req.decoded.logedinuser.companyid || 0), function (err, result) {
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
			
			var sql = "INSERT INTO cutomermaster set ?";
			var obj = req.body[0]
			var message = "Record inserted successfully";
		}
		if(req.body[0].id)
		{
		var sql = "UPDATE cutomermaster set ? WHERE id = ?";	
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
            con.query('SELECT * FROM `cutomermaster` WHERE `id` = ' + req.params.customerid, function (err, result) {
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
						 con.query('DELETE FROM `cutomermaster` WHERE `id` = ' + req.params.customerid, function (err, result) {
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




//DASHBOARD

exports.GetDashboardCount = function(req,res)
{
    if (req.decoded.success == true) {
        connection.acquire(function (err, con) {
			
			
			if(req.params.interval === 'Week')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = id AND WEEKOFYEAR(ordermaster.createddate) = WEEKOFYEAR(CURDATE()))),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND WEEKOFYEAR(pomaster.createddate) = WEEKOFYEAR(CURDATE()))),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
			}
			if(req.params.interval === 'Month')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = id AND MONTH(ordermaster.createddate) = MONTH(CURDATE()) AND YEAR(ordermaster.createddate) = YEAR(CURDATE()))),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND MONTH(pomaster.createddate) = MONTH(CURDATE()) AND YEAR(pomaster.createddate) = YEAR(CURDATE()))),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
			}	
			if(req.params.interval === 'Year')
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = id AND YEAR(ordermaster.createddate) = YEAR(CURDATE()))),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND YEAR(pomaster.createddate) = YEAR(CURDATE()))),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
			}			
			else
			{
				var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = id AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
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
			  var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = companymaster.id AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = "'+fromdate+'")),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = "'+fromdate+'")),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
		  }
		  if(fromdate == undefined)
		  {
			  var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = companymaster.id AND DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") = DATE_FORMAT(CURDATE(),"%d-%m-%Y"))),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
		  }
		  if(todate != undefined && fromdate != undefined)
		  {
			  var sql = 'SELECT id,(SELECT COUNT(*) FROM user WHERE user.companyid = companymaster.id) as totalusers,(SELECT COUNT(*) FROM brand WHERE brand.companyid = companymaster.id) as totalbrands,(SELECT COUNT(*) FROM product WHERE product.companyid = companymaster.id) as totalproducts,IFNULL((SELECT SUM(orderdetails.mrp * orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid IN (SELECT ordermaster.id FROM ordermaster WHERE ordermaster.companyid = companymaster.id AND (DATE_FORMAT(ordermaster.createddate,"%d-%m-%Y") BETWEEN "'+fromdate+'" AND "'+todate+'"))),0) AS totalorderamt,(SELECT COUNT(*) FROM cutomermaster WHERE cutomermaster.companyid = companymaster.id ) AS totalcustomers,(SELECT COUNT(*) FROM inquiries WHERE inquiries.companyid = companymaster.id) as totalinquiries,IFNULL((SELECT SUM(podetails.qty * podetails.qty) FROM podetails WHERE podetails.poid IN (SELECT pomaster.id FROM pomaster WHERE pomaster.companyid = companymaster.id AND (DATE_FORMAT(pomaster.createddate,"%d-%m-%Y") BETWEEN "'+fromdate+'" AND "'+todate+'"))),0) AS totalpoamt FROM companymaster WHERE `id`= ' + (req.decoded.logedinuser.companyid || 0)
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


exports.getMonthlysaleNPurchase = function(req,res)
{
	  if (req.decoded.success == true) {
				 connection.acquire(function (err, con) {
			 con.query('SELECT (SELECT SUM(orderdetails.qty) FROM orderdetails WHERE orderdetails.orderid = ordermaster.id) as saledqty,MONTHNAME(ordermaster.createddate) AS saledmonth FROM ordermaster WHERE ordermaster.companyid = '+(req.decoded.logedinuser.companyid || 0), function (err, saleresult) {
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
                   
				    con.query('SELECT IFNULL((SELECT SUM(podetails.qty) FROM podetails WHERE podetails.poid = pomaster.id),0) AS totalpoqty,MONTHNAME(pomaster.createddate) AS saledmonth FROM pomaster WHERE pomaster.companyid = '+(req.decoded.logedinuser.companyid || 0), function (err, poresult) {
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
					var result = [saleresult,poresult]
                    res.send(result);
                    con.release();
                }
            });
				   
                }
            });
		}); 
		
	  }
};

