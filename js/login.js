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
		if(this.DOBDay.length == 1){
			if(isPositiveInteger(this.DOBDay)){
				if(this.DOBDay > 4){
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
		last = this.DOBDay;
	}

	this.monthValidator = function(){
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
		lastM = this.DOBMonth;
	}

	this.yearValidator = function(){
		if(this.DOBYear.length != 0 && (!isPositiveInteger(this.DOBYear) || this.DOBYear > 2000) ){
			this.DOBYear = last;
		}
		last = this.DOBYear;
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