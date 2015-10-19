(function(){
var app = angular.module('login',['navbar','ngAnimate','footer']);

	if(document.cookie.indexOf('user=') != -1){
		location.href = 'index.html';
	}	
	this.last = this.DOBDay;
	this.lastM = this.DOBMonth;
	this.lastY = this.DOBYear;
app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
app.directive('customFooter',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "footer.html"
 	};

 });
app.directive('register',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "register.html"
 	};

 });

app.controller('RegisterController',function($scope,$http,$log){
	$scope.isRegistering = false;
	var focus = this;
	this.registerUser = function(){
		this.birthDate = this.DOBYear + "-"+ this.DOBMonth + "-" + this.DOBDay;
		this.user = '{"username":"'+this.username+'","password":"'+this.pass1+'","firstName":"'+this.firstname+'","lastName":"'+this.lastname+'","gender":"'+this.gender+'","identityCard":"'+this.identityCard+'","email":"'+this.email+'","birthDate":"'+this.birthDate+'"}';
		$log.debug(this.user);
		$scope.loadingR = true;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAccount&account='+this.user).then(function(res){
			$log.debug(res);
			$scope.loadingR = false;
			if(res.data.error !== undefined){
				if(res.data.error.code == 200){
					$scope.userAlreadyExists = true;
					$scope.dniAlreadyExists = false;
				}else if(res.data.error.code == 201){
					$scope.dniAlreadyExists = true;
					$scope.userAlreadyExists = false;
				}else{
					alert('Ocurrio un error inesperado, vuelva a intentarlo mas tarde');
					$scope.userAlreadyExists = false;
					$scope.dniAlreadyExists = false;
				}
			}else{
				$scope.userAlreadyExists = false;
				$scope.dniAlreadyExists = false;
				$scope.registered = true;
				$("#RegisterSuccess").modal('toggle');
				$scope.isRegistering = false;
				focus.username = undefined;
				focus.email = undefined;
				focus.firstname = undefined;
				focus.lastname = undefined;
				focus.pass1 = undefined;
				focus.pass2 = undefined;
				focus.birthDate = undefined;
				focus.identityCard = undefined;
			}
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
			if($('#username').hasClass('ng-dirty')){
				$('#username').popover('show');
				$('#username').parent().addClass('has-error');
			}
			return false;
		}
		$('#username').popover('hide');
		$('#username').parent().removeClass('has-error');
		$('#username').parent().addClass('has-success');

		if(this.email === undefined || this.email.indexOf('@') == -1 || this.email.indexOf('.') == -1 ||  this.email.lastIndexOf('.') - this.email.indexOf('@') < 2){
			if($('#email').hasClass('ng-dirty')){
				$('#email').parent().addClass('has-error');
			}
			return false;
		}
		$('#email').parent().removeClass('has-error');
		$('#email').parent().addClass('has-success');
		if(this.firstname === undefined || this.firstname.length > 80 || this.lastname === undefined || this.lastname.length > 80){
			$('#firstname').parent().addClass('has-error');
			$('#lastname').parent().addClass('has-error');
			return false;
		}
		$('#firstname').parent().addClass('has-success');
		$('#lastname').parent().addClass('has-success');
		$('#firstname').parent().removeClass('has-error');
		$('#lastname').parent().removeClass('has-error');
		if(this.pass1 === undefined){
			if($('#pass1').hasClass('ng-dirty')){
				$('#pass1').parent().addClass('has-error');
			}
			return false;
		}
		if(this.pass1.length < 8 || this.pass1.length > 15){
			$('#pass1').parent().addClass('has-error');
	 		$('#pass1').popover('show');
	 		return false;
	 	}
	 	$('#pass1').popover('hide');
	 	$('#pass1').parent().addClass('has-success');
	 	$('#pass1').parent().removeClass('has-error');
		if(this.pass1 !== this.pass2){
			if($('#pass2').hasClass('ng-dirty')){
				$('#pass2').parent().addClass('has-error');
				$('#pass2').popover('show');
			}
			return false;
		}
		$('#pass2').popover('hide');
		$('#pass2').parent().addClass('has-success');
		$('#pass1').parent().removeClass('has-error');
		$('#pass2').parent().removeClass('has-error');
		if(!isPositiveInteger(this.identityCard) || this.identityCard.length > 10){
			if($('#dni').hasClass('ng-dirty')){
				$('#dni').parent().addClass('has-error');
			}
			return false;
		}
		$('#dni').parent().addClass('has-success');
		$('#dni').parent().removeClass('has-error');
		if(this.DOBDay === undefined || this.DOBMonth === undefined || this.DOBYear === undefined){
			$('#year').parent().parent().parent().addClass('has-error');
			return false;
		}
		if(this.DOBYear !== undefined && this.DOBYear < 1900){
			$('#year').parent().parent().parent().addClass('has-error');
			$('#year').popover('show');
			return false;
		}
		$('#year').parent().parent().parent().addClass('has-success');
		$('#year').parent().parent().parent().removeClass('has-error');
					$('#year').popover('hide');
		if(this.gender !== 'M' && this.gender !== 'F'){
			$('#MRB').parent().parent().addClass('has-error');
			return false;
		}

		return true;
	}
});


app.controller("LoginController",function($scope,$http,$log){
	$log.debug($scope);
	this.validLogin = true;

	var store = this;
	this.login = function(){
		$scope.loadingL = true;
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + $scope.loginUser + "&password=" + $scope.loginPass).then(function(res){
			$scope.loadingL = false;
			if(res.data.error !== undefined){
				store.validLogin = false;
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