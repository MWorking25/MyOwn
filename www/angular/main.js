angular.module('MyApp', ['ngSanitize','ngAnimate','ngRoute','ui.bootstrap','ngFileUpload','ngIdle','ngCookies']).config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
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
    .when("/Vendors", {
        templateUrl : "public/Vendors.html",
		controller:"ProductController"
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
}).config(
    function setupConfig( $httpProvider ) {
        // Wire up the traffic cop interceptors. This method will be invoked with
        // full dependency-injection functionality.
        // --
        // NOTE: This approach has been available since AngularJS 1.1.4.
        $httpProvider.interceptors.push( interceptHttp );
        // We're going to TRY to track the outgoing and incoming HTTP requests.
        // I stress "TRY" because in a perfect world, this would be very easy
        // with the promise-based interceptor chain; but, the world of
        // interceptors and data transformations is a cruel she-beast. Any
        // interceptor may completely change the outgoing config or the incoming
        // response. As such, there's a limit to the accuracy we can provide.
        // That said, it is very unlikely that this will break; but, even so, I
        // have some work-arounds for unfortunate edge-cases.
        function interceptHttp( $q, trafficCop ) {
            // Return the interceptor methods. They are all optional and get
            // added to the underlying promise chain.
            return({
                request: request,
                requestError: requestError,
                response: response,
                responseError: responseError
            });
            // ---
            // PUBLIC METHODS.
            // ---
            // Intercept the request configuration.
            function request( config ) {
                // NOTE: We know that this config object will contain a method as
                // this is the definition of the interceptor - it must accept a
                // config object and return a config object.
                trafficCop.startRequest( config.method );
					//console.log(config);
                // Pass-through original config object.
                return( config );
            }
            // Intercept the failed request.
            function requestError( rejection ) {
                // At this point, we don't why the outgoing request was rejected.
                // And, we may not have access to the config - the rejection may
                // be an error object. As such, we'll just track this request as
                // a "GET".
                // --
                // NOTE: We can't ignore this one since our responseError() would
                // pick it up and we need to be able to even-out our counts.
                trafficCop.startRequest( "get" );
                // Pass-through the rejection.
                return( $q.reject( rejection ) );
            }
            // Intercept the successful response.
            function response( response ) {
                trafficCop.endRequest( extractMethod( response ) );
                // Pass-through the resolution.
                return( response );
            }
            // Intercept the failed response.
            function responseError( response ) {
                trafficCop.endRequest( extractMethod( response ) );
                // Pass-through the rejection.
                return( $q.reject( response ) );
            }
            // ---
            // PRIVATE METHODS.
            // ---
            // I attempt to extract the HTTP method from the given response. If
            // another interceptor has altered the response (albeit a very
            // unlikely occurrence), then we may not be able to access the config
            // object or the the underlying method. If this fails, we return GET.
            function extractMethod( response ) {
                try {
                    return( response.config.method );
                } catch ( error ) {
                    return( "get" );
                }
            }
        }
    }
    
// I keep track of the total number of HTTP requests that have been initiated
// and completed in the application. I work in conjunction with an HTTP
// interceptor that pipes data from the $http service into get/end methods
).filter('startFrom', function () {
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