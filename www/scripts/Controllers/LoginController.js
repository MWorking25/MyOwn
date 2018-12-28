angular.module('MyApp')
	.controller('LoginController', function ($scope, $http, $route, $location, $window, $timeout) {


		M.AutoInit();
		

		$scope.openNav = function() {
			document.getElementById("mySidenav").style.width = "250px";
		  }
		  
		  $scope.closeNav = function() {
			document.getElementById("mySidenav").style.width = "0";
		  }
		  

		  $scope.HitNav = function() {
			if(document.getElementById("mySidenav").style.width == '' || document.getElementById("mySidenav").style.width == '0px')
			{
			  $scope.openNav()
			}
			else
			{
			  $scope.closeNav();
			}
			  
			  }
			  $(document).click(function(e){
				if ($(e.target).is('.container,.container *')) {
				  $scope.closeNav();
				}
				else
				{
				 
				}
			});
				
			  
			  $scope.NotificationsList = []
			  for(var i = 0 ; i < 15;i++)
			  {
				$scope.NotificationsList.push({message:"message text"+i})
			  }
		  
		$timeout(function () {
			$scope.test1 = "Hello World!";
		}, 5000);

		//time
		$scope.time = 60;

		//timer callback
		var timer = function () {
			if ($scope.time > 0) {
				$scope.time -= 1;
				$timeout(timer, 1000);
			}
		}

		//run!!

		


		$scope.paswdvsicon = "visibility";
		$scope.paswdvsiconconf = "visibility";
		$scope.curpaswdvsicon = "visibility";

		$scope.showHidePassword = function (elemid) {
			var passwordfield = document.getElementById(elemid);
			if (passwordfield.type === "password") {
				passwordfield.type = "text";
				if ($scope.confirm_password) {
					$scope.paswdvsiconconf = "visibility_off";
					return false;
				}
				if ($scope.UserDetails[0].password) {
					$scope.paswdvsicon = "visibility_off";
					return false;
				}

				if ($scope.UserDetails[0].currentpassword) {
					$scope.curpaswdvsicon = "visibility_off";
					return false;
				}
			} else {
				passwordfield.type = "password";
				if ($scope.confirm_password) {
					$scope.paswdvsiconconf = "visibility";
					return false;
				}
				if ($scope.UserDetails[0].password) {
					$scope.paswdvsicon = "visibility";
					return false;
				}
				if ($scope.UserDetails[0].currentpassword) {
					$scope.curpaswdvsicon = "visibility";
					return false;
				}
			}
		};




		$scope.authUser = function () {
			$location.path('/Dashboard');
			// 	$http({
			// 	method  : 'POST',
			// 	url     : '/api/authUser',
			// 	data    : $scope.userDetails ,
			// 	headers : {'Content-Type': 'application/json'} 
			// }).then(function(response) {
			// 	if(response.data.success === true)
			// 	{
			// 		$location.path('/Dashboard');
			// 	}
			// 	if(response.data.success === false)
			// 	{
			// 		$scope.errormsg = response.data.message
			// 	}
			// });
		};


		$scope.ResetPassword = function () {
			$http({
				method: 'POST',
				url: '/api/ResetPassword',
				data: $scope.usersPassworddata,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				alert(response.data.message);
				location.reload();
			});
		};

		$scope.arrayObj = [{
			otp: ''
		}, {
			otp: ''
		}, {
			otp: ''
		}, {
			otp: ''
		}, {
			otp: ''
		}, {
			otp: ''
		}];
		$scope.focusIndex = 0;
		$scope.ForgotPassword = function () {

			$http({
				method: 'POST',
				url: '/api/ForgotPassword',
				data: $scope.user,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {

				if (response.data.success === true) {
					$scope.message = response.data.message;
					$('#myModallOTP').modal({
						backdrop: 'static',
						keyboard: true,
						show: true
					});
					$timeout(function () {
						$scope.showbtn = true;
						$timeout(timer, 1000);
					}, 20000);


				} else {
					alert(response.data.message)
				}
			});
		};

		$scope.SetFocus = function (index) {
			$scope.focusIndex = index;
		};

		$scope.SubmitOtpAnResetpassword = function () {
			var OTP = '';
			$scope.arrayObj.map(function (indval) {
				OTP = OTP + '' + indval.otp;
			});

			$http({
				method: 'GET',
				url: '/api/verifyOTP/' + OTP.trim(),
				dataType: 'jsonp'
			}).then(function (response) {
				if (response.data.status === 0) {
					$('#myModallOTP').modal({
						show: false
					});
					$('#myModallNewPassword').modal({
						backdrop: 'static',
						keyboard: true,
						show: true
					});
				} else {
					alert(response.data.message);
				}
			});
		};


		$scope.Listusers = function () {
			$http({
				method: 'GET',
				url: '/api/Listusers/',
				dataType: 'jsonp'
			}).then(function (response) {
				var Listusers = response.data;
				console.log(Listusers)
			});
		}

		$scope.UserRole = ['Admin', 'Staff'];

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

	}).directive('customAutofocus', function () {
		return {
			restrict: 'A',

			link: function (scope, element, attrs) {
				scope.$watch(function () {
					return scope.$eval(attrs.customAutofocus);
				}, function (newValue) {
					if (newValue == true) {
						element[0].focus();
					}
				});
			}
		};
	});