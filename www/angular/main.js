angular.module('MyApp', ['ngSanitize','ngRoute','ui.bootstrap','ngFileUpload','ngIdle','ngCookies']).config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(90);
    IdleProvider.timeout(90);
    KeepaliveProvider.interval(10);

    IdleProvider.interrupt('keydown wheel mousedown touchstart touchmove scroll');
}]).config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "public/Login.html",
		controller:"LoginController"
    })
    .when("/Login", {
        templateUrl : "public/Login.html",
		controller:"LoginController"
    })
	.when("/Dashboard", {
        templateUrl : "public/Dashboard.html",
		controller:"DashboardController"
    })
    .when("/Users", {
        templateUrl : "public/Users.html",
		controller:"LoginController"
    })
    .when("/Brands", {
        templateUrl : "public/Brands.html",
		controller:"ProductController"
    })
    .when("/Products", {
        templateUrl : "public/Products.html",
		controller:"ProductController"
    })
    .when("/Customers", {
        templateUrl : "public/Customers.html",
		controller:"ProductController"
    })
    .when("/Sales", {
        templateUrl : "public/Sales.html",
		controller:"ProductController"
    })
    .when("/Purchase", {
        templateUrl : "public/Purchase.html",
		controller:"DashboardController"
    })
    .when("/Inventory", {
        templateUrl : "public/Inventory.html",
		controller:"DashboardController"
    })
    .when("/Inquiries", {
        templateUrl : "public/Inquiries.html",
		controller:"ProductController"
    })
    .when("/Companies", {
        templateUrl : "public/Companies.html",
		controller:"LoginController"
    })
    .when("/Profile", {
        templateUrl : "public/Profile.html",
		controller:"LoginController"
    }).when("/OrdersCart", {
        templateUrl : "public/OrdersCart.html",
		controller:"ProductController"
    }).when("/SetNewPassword", {
        templateUrl : "public/SetNewPassword.html",
		controller:"LoginController"
    })
	.otherwise({
		  redirectTo: ''
		});
}).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
       if(input!=undefined)
        {return input.slice(start);}
    }
}).directive('inputFocusFunction', function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        // Parse the attribute to accomodate assignment to an object
        var parseObj = attr.inputFocusFunction.split('.');
        var attachTo = scope;
        for (var i = 0; i < parseObj.length - 1; i++) {
          attachTo = attachTo[parseObj[i]];
        }
        // assign it to a function that focuses on the decorated element
        attachTo[parseObj[parseObj.length - 1]] = function() {
          element[0].focus();
        };
      }
    };
  });

