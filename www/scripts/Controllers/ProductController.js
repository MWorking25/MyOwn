angular.module('MyApp').controller('ProductController', function ($scope, $http, $route, $location, $window, $timeout) {


  M.AutoInit();
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
    console.log($scope.CartList)
  };

  $scope.BrandsList = [{
    id: 1,
    name: 'brand 1',
    description: 'n.a'
  }, {
    id: 2,
    name: 'brand 2',
    description: 'n.a'
  }];


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

});