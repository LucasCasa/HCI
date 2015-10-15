(function() {
var app = angular.module('Cuenta', ['navbar']);

	if(document.cookie.indexOf('user=') == -1){
		location.href='index.html';
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
  app.directive('addAddress',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "add-address.html"
 	};

 });
 app.controller("CuentaController",function($http,$log,$scope){
 	var cookie = document.cookie;
 	var user = cookie.substring(cookie.indexOf('user=')+5,cookie.length);
 	var token = cookie.substring(cookie.indexOf('token=') + 6, cookie.indexOf('user=')-2);
 	var focus = this;
 	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username="+user +"&authentication_token="+token).then(function(res){
 		$scope.user = res.data.account;
 		$scope.user.identityCard = parseInt($scope.user.identityCard);
 		focus.DOB = $scope.user.birthDate.split('-');
 		$log.debug($scope.user.gender);
 		$log.debug(user);
 		$log.debug(token);
 		$log.debug(res.data);
 	});
 	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username="+ user +"&authentication_token="+token).then(function(res){
 		$scope.direcciones = res.data.addresses; // Fijarse que solo devuelve 8, ya que esta pensado para que haya muchas paginas de direcciones
 		$log.debug($scope.direcciones);
 	});
 	$scope.isAddress= function(){
 		return ($scope.direcciones == undefined || $scope.direcciones.length == 0);
 	}
 	$scope.saveAddress = function(){
 		var name = '"name":"' + $scope.IdName + '"';
 		var street = ',"street":"' + $scope.street + '"';
 		var number = ',"number":"' + $scope.number + '"';
 		var floor = ($scope.floor === undefined)?"":',"floor":"' + $scope.floor + '"';
 		var gate = ($scope.gate === undefined)?"":',"gate":"' + $scope.dpto + '"';
 		var zipCode = ',"zipCode":"' + $scope.postalCode + '"';
 		var province = ',"province":"C"'//',"province":"' + $scope.getProvinceId($scope.province) + '"';
 		var city = ($scope.city === undefined)?"":',"city":"' + $scope.city + '"';
 		var phoneNumber = ',"phoneNumber":"' + $scope.telephone + '"';

 		var address ='{'+name+street+number+floor+gate+zipCode+province+city+phoneNumber+'}';
 		$log.debug("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ address);
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ address).then(function(res){
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
		if(this.email === undefined || this.email.indexOf('@') == -1 || this.email.indexOf('.') == -1 ||  this.email.lastIndexOf('.') - this.email.indexOf('@') < 2){
			return false;
		}
		$('#email').parent().addClass('has-success');
		if(this.firstname === undefined || this.firstname.length > 80 || this.lastname === undefined || this.lastname.length > 80){
			return false;
		}
		$('#firstname').parent().addClass('has-success');
		$('#lastname').parent().addClass('has-success');
		if(this.pass1 === undefined){
			return false;
		}
		if(this.gender !== 'M' && this.gender !== 'F'){
			return false;
		}
		if(!isPositiveInteger(this.identityCard) || this.identityCard.length > 10){
			return false;
		}
		if(this.DOBDay === undefined || this.DOBMonth === undefined || this.DOBYear === undefined){
			if(this.DOBYear !== undefined && this.DOBYear > 1900){
				$('#DOBYear').popover('show');
			}
			return false;
		}
		return true;
	}


 });
 app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

})();