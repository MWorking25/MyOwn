angular.module('MyApp')
	.controller('ProductController', ['$scope', '$http', '$route', '$location', '$window', '$timeout', 'Upload','Idle', 'Keepalive', function ($scope, $http, $route, $location, $window, $timeout, Upload, Idle, Keepalive) {



  M.AutoInit();
  
		
  $scope.SignOut = function () {
    $http({
      method: 'GET',
      url: '/api/SignOut/',
      dataType: 'jsonp'
    }).then(function (response) {
     $location.path('/');
    });
  };

  
  
  
	$scope.$on('IdleStart', function() {
				// the user appears to have gone idle
		 });
		 $scope.$on('IdleTimeout', function() {
		   // the user has timed out, let log them out
		 $scope.SignOut()
		 });
		 $scope.$on('IdleEnd', function() {
		  // the user has come back from AFK and is doing stuff
		 });
	
	
	  Idle.watch();

  
  

  $scope.openNav = function () {
    document.getElementById("mySidenav").style.width = "250px";
  }

  $scope.closeNav = function () {
    document.getElementById("mySidenav").style.width = "0";
  }


  $scope.HitNav = function () {
    if (document.getElementById("mySidenav").style.width == '' || document.getElementById("mySidenav").style.width == '0px') {
      $scope.openNav()
    } else {
      $scope.closeNav();
    }

  };

  $(document).click(function (e) {
    if ($(e.target).is('.container,.container *')) {
      $scope.closeNav();
    } else {

    }
  });


  $scope.NotificationsList = []
  $scope.CartList = [];
  for (var i = 0; i < 35; i++) {
    $scope.NotificationsList.push({
      id: i,
      message: "Product Name- " + i
    })
  }
  
  
  
  /* PAGINATION */
  
  
		$scope.checkcurrpage=function(myValue){
			
			if(myValue == null || myValue == 0)
				myValue = 1;
			
		if(!myValue){
		 window.document.getElementById("mypagevalue").value = $scope.currentPage+1;
		 var element = window.document.getElementById("mypagevalue");
		 if(element)
			 element.focus();
		$scope.currentPage = $scope.currentPage;
		$scope.myValue = null;
		}
		
		else{
			$scope.dispval = "";
			if(myValue-1 <= 0){
				$scope.currentPage=0;
			}
			else{
				$scope.currentPage=myValue-1;
				
				if(!$scope.currentPage){$scope.currentPage=0;}
			}
		}};
			
			$scope.pagination = function(listdata)
			{
					$scope.recordsdisplay = [{value:10,name:10},{value:25,name:25},{value:50,name:50},{value:100,name:100},{value:listdata.length,name:'All'}]
					$scope.currentPage = 0;
					$scope.pageSize = 10;
					if($scope.myValue > listdata.length)
					{
						$scope.myValue = 1;
					}
					$scope.numberOfPages = function () {
						return Math.ceil(listdata.length / $scope.pageSize);
					};
			};
	
  
  /* PAGINATION */
  
  
  
  
  

  $scope.Updatecart = function (type, product) {
    if (type === 'add') {
      if ($scope.CartList.length <= 0) {
        product.qty = (product.qty ? product.qty : 0) + 1
        $scope.CartList.push(product)
      } else {
        $scope.CartList.map(function (value, index) {
          if (value.id === product.id) {
            product.qty = (product.qty ? product.qty : 0) + 1
            value.qty = product.qty;
          } else {
            var found = $scope.CartList.find(function (obj) {
              return obj.id === product.id;
            });
            if (!found) {
              product.qty = (product.qty ? product.qty : 0) + 1
              $scope.CartList.push(product)
            }
          }
        });
      }
    }
    if (type === 'remove') {
      $scope.CartList.map(function (value, index) {
        if (value.id === product.id) {
          product.qty = (product.qty ? product.qty : 0) - 1
          value.qty = product.qty;
          if ($scope.CartList[index].qty === 0) {
            $scope.CartList.splice(index, 1)
          }
        }
      });
    }
  };

   $scope.CalculateNetamount = function (salesDeatils) {
     var netamount = 0;
    if(!salesDeatils)
    {
        $scope.CartList.map(function (value, index) {
          netamount += (value.mrp * value.qty);
        });
    }
    if(salesDeatils)
    {
      salesDeatils.map(function (value, index) {
        netamount += (value.mrp * value.qty);
      });
    }
    return netamount; 
  }; 


  $scope.SubmitOrder = function () {
    $scope.CartList[0].netamount = $scope.CalculateNetamount();
    $http({
      method: 'POST',
      url: '/api/SubmitOrder',
      data: $scope.CartList,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      Swal({
        type: response.data.type,
        title: response.data.title,
        text: response.data.message,
      }).then(() => {
        location.reload();
      })
    });
  };


  $scope.UpdateSaleOrder = function () {
    $scope.SalesDetails[0].newnetamount = $scope.CalculateNetamount();
    $http({
      method: 'POST',
      url: '/api/UpdateSaleOrder',
      data: $scope.SalesDetails,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      Swal({
        type: response.data.type,
        title: response.data.title,
        text: response.data.message,
      }).then(() => {
        location.reload();
      })
    });
  };


  // BRANDS

  $scope.ListBrands = function (indicator) {
    $http({
      method: 'GET',
      url: '/api/ListBrands/',
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.BrandsList = response.data;
	  if(indicator === '1')
	  {
		  $scope.NavHeader = "Brands";
		  $scope.pagination($scope.BrandsList);
	  }
    });
  };


  $scope.getBrandDetails = function (brandid) {
    $http({
      method: 'GET',
      url: '/api/getBrandDetails/' + brandid,
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.brandDetails = response.data;
    });
  };


  $scope.DeleteBrandDetails = function (brandid) {

    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        $http({
          method: 'DELETE',
          url: '/api/DeleteBrandDetails/' + brandid,
          dataType: 'jsonp'
        }).then(function (response) {
          Swal({
            type: response.data.type,
            title: response.data.title,
            text: response.data.message,
          }).then(() => {
            $scope.ListBrands();
          })
        });
      }
    })


  };
  
  
  
  $scope.SaveBrandDetails = function () {
    $http({
      method: 'POST',
      url: '/api/SaveBrandDetails',
      data: $scope.brandDetails,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      Swal({
        type: response.data.type,
        title: response.data.title,
        text: response.data.message,
      }).then(() => {
        location.reload();
      })
    });
  };


//CUSTOMERS

$scope.ListCustomers = function (indecator) {
  $http({
    method: 'GET',
    url: '/api/ListCustomers/',
    dataType: 'jsonp'
  }).then(function (response) {
    $scope.CustomersList = response.data;
	if(indecator === '1')
	{
		$scope.pagination($scope.CustomersList);
	}
  });
};

$scope.GetCustomerDetails = function (customerid) {
  $http({
    method: 'GET',
    url: '/api/GetCustomerDetails/'+customerid,
    dataType: 'jsonp'
  }).then(function (response) {
    $scope.CustomerDetails = response.data;
    if($scope.CartList.length > 0)
    {
      $scope.CartList[0].mobileno = $scope.CustomerDetails[0].mobile;
      $scope.CartList[0].email = $scope.CustomerDetails[0].email;
      $scope.CartList[0].address = $scope.CustomerDetails[0].address;
    }
  });
};

$scope.SaveCustomerDetails = function()
{
	$http({
      method: 'POST',
      url: '/api/SaveCustomerDetails',
      data: $scope.CustomerDetails,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      Swal({
        type: response.data.type,
        title: response.data.title,
        text: response.data.message,
      }).then(() => {
        location.reload();
      })
    });
};

$scope.DeleteCustomerDetails = function (custid) {

    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        $http({
          method: 'DELETE',
          url: '/api/DeleteCustomerDetails/' + custid,
          dataType: 'jsonp'
        }).then(function (response) {
          Swal({
            type: response.data.type,
            title: response.data.title,
            text: response.data.message,
          }).then(() => {
            $scope.ListCustomers();
          })
        });
      }
    })


  };
  
  // INQUIRIES
  
$scope.ListInquiries = function (indecator) {
  $http({
    method: 'GET',
    url: '/api/ListInquiries/',
    dataType: 'jsonp'
  }).then(function (response) {
    $scope.InquirysList = response.data;
	if(indecator === '1')
	{
		$scope.pagination($scope.InquirysList);
	}
  });
};

$scope.GetInquiryDetails = function (inquiryid) {
  $http({
    method: 'GET',
    url: '/api/GetInquiryDetails/'+inquiryid,
    dataType: 'jsonp'
  }).then(function (response) {
    $scope.InquiryDetails = response.data;
  });
};

$scope.SaveInquiryDetails = function()
{
	$http({
      method: 'POST',
      url: '/api/SaveInquiryDetails',
      data: $scope.InquiryDetails,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      Swal({
        type: response.data.type,
        title: response.data.title,
        text: response.data.message,
      }).then(() => {
        location.reload();
      })
    });
};

$scope.DeleteInquiryDetails = function (inquiryid) {

    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        $http({
          method: 'DELETE',
          url: '/api/DeleteInquiryDetails/' + inquiryid,
          dataType: 'jsonp'
        }).then(function (response) {
          Swal({
            type: response.data.type,
            title: response.data.title,
            text: response.data.message,
          }).then(() => {
            $scope.ListInquiries();
          })
        });
      }
    })


  };

  // PRODUCTS

  $scope.ListProducts = function (indecator) {
    $http({
      method: 'GET',
      url: '/api/ListProducts/',
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.ProductsList = response.data;
	  if(indecator === '1')
	  {
		  $scope.pagination($scope.ProductsList);
	  }
    });
  };

  $scope.GetProductDetails = function (productid) {
    $http({
      method: 'GET',
      url: '/api/GetProductDetails/' + productid,
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.ProductDetails = response.data;
    });
  };

  $scope.DeleteProductDetails = function (productid) {
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        $http({
          method: 'DELETE',
          url: '/api/DeleteProductDetails/' + productid,
          dataType: 'jsonp'
        }).then(function (response) {
          Swal({
            type: response.data.type,
            title: response.data.title,
            text: response.data.message,
          }).then(() => {
            $scope.ListBrands();
            $scope.ListProducts();
          })
        });
      }
    })
  };
  

  $scope.SaveProductDetails = function () {
    if ($scope.productsdetails.file.$valid && $scope.prdimage) {
      var passeddata = {
        file: $scope.prdimage,
        productDetails: $scope.ProductDetails[0]
      }
    } else {
      var passeddata = {
        productDetails: $scope.ProductDetails[0]
      }
    }
    Upload.upload({
      url: '/api/SaveProductDetails',
      data: passeddata
    }).then(function (resp) {
      Swal({
        type: resp.data.type,
        title: resp.data.title,
        text: resp.data.message,
      }).then(() => {
        location.reload();
      })
    }, function (resp) {
      Swal({
        type: resp.data.type,
        title: resp.data.title,
        text: resp.data.message,
      }).then(() => {
        location.reload();
      })
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };

//    SALES DETAILS


$scope.GetSaleListOninterval = function(interval)
{
	$scope.saleinterval = interval;
	$http({
        method: 'GET',
        url: '/api/GetSaleListOninterval/'+interval,
        dataType: 'jsonp'
      }).then(function (response) {
        $scope.SalesList = response.data
		$scope.pagination($scope.SalesList);
      });
};


$scope.GenerateInvoiceCopy = function(orderid)
{
	$http({
        method: 'GET',
        url: '/api/GenerateInvoiceCopy/'+orderid,
        dataType: 'jsonp'
      }).then(function (response) {
        if(response.data.status === 0)
		{
			var invoicecopy = response.data.filename;
			document.getElementById("pdfinvoice").src = 'http://localhost:8082/pdf/'+invoicecopy;
			console.log(document.getElementById("pdfinvoice"));
		}
		else
		{
			Swal({
        type: response.data.type,
        title: response.data.title,
        text: response.data.message,
		  }).then(() => {
			location.reload();
		  })
		}
      });
};

$scope.GetsaleListOndates = function (fromdate,todate) {
      $http({
        method: 'GET',
        url: '/api/GetsaleListOndates/'+fromdate+'/'+todate,
        dataType: 'jsonp'
      }).then(function (response) {
        $scope.SalesList = response.data
		console.log($scope.SalesList);
      });
    };
	
	
	$scope.GetSalesDetails = function (saleid) {
      $http({
        method: 'GET',
        url: '/api/GetSalesDetails/'+saleid,
        dataType: 'jsonp'
      }).then(function (response) {
        $scope.SalesDetails = response.data
      });
    };
	
	$scope.AddNewSku = function()
	{
		var blank = $scope.SalesDetails.filter((value)=>{
			return !value.productname 
		});
		if(blank.length > 0)
		return false;
		else
		$scope.SalesDetails.push({});	
	};
  
  $scope.RemoveProduct = function(productobj,index)
	{
    if(!productobj.detailid)
    {
      $scope.SalesDetails.splice(index,1);
    }
    
    if(productobj.detailid)
    {
      $http({
        method: 'DELETE',
        url: '/api/RemoveSaledProduct/'+productobj.detailid,
        dataType: 'jsonp'
      }).then(function (response) {
        if(response.data.status === 0)
        {
          $scope.GetSalesDetails(productobj.masterid);
        }
      });
    }
	};
	
	
	
$scope.DeleteSalesDetails = function (saleid) {
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        $http({
          method: 'DELETE',
          url: '/api/DeleteSalesDetails/' + saleid,
          dataType: 'jsonp'
        }).then(function (response) {
          Swal({
            type: response.data.type,
            title: response.data.title,
            text: response.data.message,
          }).then(() => {
            $scope.GetSaleListOninterval($scope.saleinterval);
          })
        });
      }
    })
  };




// EXTRA


  
$(window).scroll(function() {
	console.log('function');
    $("#confcart").css({
      "margin-top": ($(window).scrollTop()) + "px",
    });
  });


  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#imgpanel').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#imgInp").change(function () {
    readURL(this);
  });

  $scope.clear = function () {
    $("#imgInp").val(null);
    document.getElementById("imgpanel").src = '';
  };


  function getCoockies() {
    $http({
      method: 'GET',
      url: '/api/getCoockies/',
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.credentials = response.data;
    });
  };

  getCoockies();

  
  



}]);