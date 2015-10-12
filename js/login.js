(function(){
var app = angular.module('login',['navbar']);

	if(document.cookie.indexOf('user=') != -1){
		location.href = 'index.html';
	}	
	this.last = this.DOBDay;
	this.lastM = this.DOBMonth;
	this.lastY = this.DOBYear;
	app.factory('UserCache', ['$cacheFactory', function($cacheFactory) {
    	return $cacheFactory('super-cache');
  	}]);
app.controller('RegisterController',function($scope,$http,$log){
	$scope.isRegistering = false;
	this.registerUser = function(){
		this.birthDate = this.DOBYear + "-"+ this.DOBMonth + "-" + this.DOBDay;
		this.user = '{"username":"'+this.username+'","password":"'+this.pass1+'","firstName":"'+this.firstname+'","lastName":"'+this.lastname+'","gender":"'+this.gender+'","identityCard":"'+this.identityCard+'","email":"'+this.email+'","birthDate":"'+this.birthDate+'"}';
		$log.debug(this.user);
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAccount&account='+this.user).then(function(res){
			$log.debug(res);

		});
	}


	this.dayValidator = function(){
		if(this.DOBDay !== undefined){
			if(this.DOBDay.length == 1){
				if(isPositiveInteger(this.DOBDay)){
					if(this.DOBDay > 3){
						this.DOBDay = '0' + this.DOBDay;
						$('#month').focus();
					}
				}else{
					this.DOBDay=last;
				}
			}else if( this.DOBDay.length >= 2){
				if(isPositiveInteger(this.DOBDay) && this.DOBDay <= 31){
					$('#month').focus();
				}else{
					this.DOBDay = last;
				}

			}
		}
		last = this.DOBDay;
	}

	this.monthValidator = function(){
		if(this.DOBMonth !== undefined){
			if(this.DOBMonth.length == 1){
				if(isPositiveInteger(this.DOBMonth)){
					if(this.DOBMonth > 1){
						this.DOBMonth = '0' + this.DOBMonth;
						$('#year').focus();
					}
				}else{
					this.DOBMonth=lastM;
				}
			}else if( this.DOBMonth.length >= 2){
				if(isPositiveInteger(this.DOBMonth) && this.DOBMonth <= 12){
					$('#year').focus();
				}else{
					this.DOBMonth = lastM;
				}

			}
		}
		lastM = this.DOBMonth;
	}

	this.yearValidator = function(){
		if(this.DOBYear !== undefined && (!isPositiveInteger(this.DOBYear) || this.DOBYear > 2000) ){
			this.DOBYear = last;
		}
		last = this.DOBYear;
	}

	this.isValid = function(){
		if(this.username === undefined || this.username.length < 6 || this.username.length > 15){
			return false;
		}
		if(this.pass1 !== this.pass2 || this.pass1 === undefined || this.pass1.length < 8 || this.pass1.length > 15){
			return false;
		}
		if(this.firstname === undefined || this.firstname.length > 80 || this.lastname === undefined || this.lastname.length > 80){
			return false;
		}
		if(this.gender !== 'M' && this.gender !== 'F'){
			return false;
		}
		if(!isPositiveInteger(this.identityCard) || this.identityCard.length > 10){
			return false;
		}
		if(this.email === undefined || this.email.indexOf('@') == -1 || this.email.indexOf('.') == -1 ||  this.email.lastIndexOf('.') - this.email.indexOf('@') < 2){
			return false;
		}
		if(this.DOBDay === undefined || this.DOBMonth === undefined || this.DOBYear === undefined || this.DOBYear < 1900){
			return false;
		}
		return true;
	}
});

app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
app.directive('register',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "register.html"
 	};

 });
app.controller("LoginController",function($scope,$http,$log){
	$log.debug($scope);
	this.login = function(){
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + $scope.loginUser + "&password=" + $scope.loginPass).then(function(res){
			if(res.data.error !== undefined){
				 alert("Usuario o contraseña incorrecta!");	
			}else{
				$log.debug("Estas logueado, tu token es: " + res.data.authenticationToken);
				document.cookie="token=" +res.data.authenticationToken+"; path=/";
				document.cookie="user=" + $scope.loginUser + "; path=/";
				location.href = 'index.html'
			}
		});
	};
});


})();
	function isPositiveInteger(n) {
    return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}