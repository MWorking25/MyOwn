angular.module('MyApp')
	.controller('LoginController', ['$scope', '$http', '$route', '$location', '$window', '$timeout', 'Upload','Idle', 'Keepalive', function ($scope, $http, $route, $location, $window, $timeout, Upload, Idle, Keepalive) {


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
			if(document.getElementById("mySidenav"))
			{
			document.getElementById("mySidenav").style.width = "0";
			}
		}


		$scope.HitNav = function () {
			if(document.getElementById("mySidenav"))
			{
			if (document.getElementById("mySidenav").style.width == '' || document.getElementById("mySidenav").style.width == '0px') {
				$scope.openNav()
			} else {
				$scope.closeNav();
			}
			}

		}
		$(document).click(function (e) {
			if ($(e.target).is('.container,.container *')) {
				$scope.closeNav();
			} else {

			}
		});


		$scope.NotificationsList = []
		for (var i = 0; i < 15; i++) {
			$scope.NotificationsList.push({
				message: "message text" + i
			})
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
								$(".loader").fadeOut("slow");
					$scope.numberOfPages = function () {
						return Math.ceil(listdata.length / $scope.pageSize);
					};
			};
	
  
  /* PAGINATION */



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


		  
  
  function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
}

function checkPassStrength(pass) {
    var score = scorePassword(pass);
		if (score > 80)
		{
			if($scope.confirm_password === $scope.UserDetails[0].password)
			{
				$('#resetpassbtn').prop('disabled', false);
			}
			return "Strong";
		}
		if (score > 60)
		{
			if($scope.confirm_password === $scope.UserDetails[0].password)
			{
				$('#resetpassbtn').prop('disabled', false);
			}
			return "Good";
		}
		if (score >= 30)
		{
			return "Weak";
		}
	
		
    return "";
}

function ColorPassword(pass) {
    var score = scorePassword(pass);
    if (score > 80)
        return "green";
    if (score > 60)
        return "#FFDB00";
    if (score >= 30)
        return "red";

    return "";
}

   $scope.verfiPasswordConf = function(password,confpassword)
  {
		if(confpassword)
		{
			if(confpassword != password)
			{
				$scope.passstrenth = "Password and confirm password does not match";
				$('#resetpassbtn').prop('disabled', true);
			}
			if(confpassword === password)
			{
				$scope.passstrenth = (checkPassStrength(password));
			}
		}
  };
  
  
  $scope.verifyPasswordStrongness = function(passkey)
  {
		if(!passkey || passkey === '')
		$scope.passwordcalc = false;
		else
		$scope.passwordcalc = true;
	
		$scope.passstrenth = (checkPassStrength(passkey));
        $scope.passscore = (scorePassword(passkey));
        $scope.prgcol = (ColorPassword(passkey));
		
		$scope.verfiPasswordConf(passkey,$scope.confirm_password);
		
  };
	
		$scope.authUser = function () {

			$http({
				method: 'POST',
				url: '/api/authUser',
				data: $scope.userDetails,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				if (response.data.success === true) {
					if(response.data.firstlogin === 0)
					{
						$location.path('/SetNewPassword');
					}
					else
					$location.path('/Dashboard');
				}
				if (response.data.success === false) {
					$scope.errormsg = response.data.message
				}
			});
		};


		$scope.SetNewPassword = function () {
			$http({
				method: 'POST',
				url: '/api/SetNewPassword',
				data: $scope.UserDetails,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				if(response.data.status == true)
				{
				Swal({
					type: response.data.type,
					title: response.data.title,
					text: response.data.message,
				}).then(() => {
					if(response.data.forgotpassword === 1)
						$location.path('/Login');
						else
						$location.path('/Dashboard');		
					});
				}
				
				else
				{
				Swal({
					type: response.data.type,
					title: response.data.title,
					text: response.data.message,
				})
				}
				
			});
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
					$scope.sentotpmessage = response.data.message;
					
					$timeout(function () {
						$scope.showbtn = true;
						$timeout(timer, 1000);
					}, 20000);


				} else {
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
					$location.path('/SetNewPassword');
				} else {
					Swal({
					type: "error",
					title: "Oops!",
					text: "OTP does not match",
				})
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

		//COMPANY DETAILS
		$scope.GetCompanyDetails = function (companyid) {
			$http({
				method: 'GET',
				url: '/api/GetCompanyDetails/' + companyid,
				dataType: 'jsonp'
			}).then(function (response) {
				$scope.CompanyDetails = response.data;
				console.log($scope.CompanyDetails)
			});
		};

		$scope.DeleteCompanyDetails = function (companyid) {

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
						url: '/api/DeleteCompanyDetails/' + companyid,
						dataType: 'jsonp'
					}).then(function (response) {
						Swal({
							type: response.data.type,
							title: response.data.title,
							text: response.data.message,
						}).then(() => {
							location.reload();
						})
					});
				}
			})
		};


		$scope.ListCompanyies = function () {
			$http({
				method: 'GET',
				url: '/api/ListCompanyies/',
				dataType: 'jsonp'
			}).then(function (response) {
				$scope.CompanysList = response.data;
			});
		};



		$scope.SaveCompanyDetails = function () {
			if ($scope.companydetails.file.$valid && $scope.logo) {
				var passeddata = {
					file: $scope.logo,
					companyDetails: $scope.CompanyDetails[0]
				}
			} else {
				var passeddata = {
					companyDetails: $scope.CompanyDetails[0]
				}
			}
			Upload.upload({
				url: '/api/SaveCompanyData',
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


		$scope.ValidateEmail = function () {
			$http({
				method: 'GET',
				url: '/api/ValidateEmail/' + $scope.CompanyDetails[0].email,
				dataType: 'jsonp'
			}).then(function (response) {
				console.log(response)
				$scope.emailvalidatemessage = response.data.message;
				$scope.emailvalidatests = response.data.status;
				if ($scope.emailvalidatests === 2) {
					$scope.SaveCompanyDetails();
				}
			});
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


	}]).directive('customAutofocus', function () {
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