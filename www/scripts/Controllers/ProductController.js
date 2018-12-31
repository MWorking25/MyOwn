angular.module('MyApp').controller('ProductController',  ['$scope', '$http', '$route', '$location', '$window', '$timeout', 'Upload', function ($scope, $http, $route, $location, $window, $timeout, Upload) {



  M.AutoInit();

  $scope.SignOut = function () {
    $http({
      method: 'GET',
      url: '/api/SignOut/',
      dataType: 'jsonp'
    }).then(function (response) {
      alert(response.data.message)
      location.href = "index.html";
    });
  };


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

  $scope.Updatecart = function (type, product) {
    if (type === 'add') {
      if ($scope.CartList.length <= 0) {
        product.qty = (product.qty ? product.qty : 0) + 1
        $scope.CartList.push(product)
      } else {
        $scope.CartList.map(function (value, index) {
          if (value.id === product.id) {
            product.qty = (product.qty ? product.qty : 0) + 1
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
          if ($scope.CartList[index].qty === 0) {
            $scope.CartList.splice(index, 1)
          }

        }
      });
    }
  };




  // BRANDS

  $scope.ListBrands = function () {
    $http({
      method: 'GET',
      url: '/api/ListBrands/',
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.BrandsList = response.data;
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
          method: 'GET',
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



  // PRODUCTS

  $scope.ListProducts = function()
  {
    $http({
      method: 'GET',
      url: '/api/ListProducts/',
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.ProductsList = response.data;
    });
  };

  $scope.GetProductDetails = function(productid)
  {
    $http({
      method: 'GET',
      url: '/api/GetProductDetails/'+productid,
      dataType: 'jsonp'
    }).then(function (response) {
      $scope.ProductDetails = response.data;
    });
  };



  $scope.SaveProductDetails = function()
  {
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

      })
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };



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