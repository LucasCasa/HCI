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
 	this.texto = '{"states": [ { "stateId": "C", "name": "Ciudad Autonoma de Buenos Aires" }, { "stateId": "B", "name": "Buenos Aires" }, { "stateId": "K", "name": "Catamarca" }, { "stateId": "H", "name": "Chaco" }, { "stateId": "U", "name": "Chubut" }, { "stateId": "X", "name": "Cordoba" }, { "stateId": "W", "name": "Corrientes" },{ "stateId": "E", "name": "Entre Rios" },{ "stateId": "P", "name": "Formosa" },{ "stateId": "Y", "name": "Jujuy" },{ "stateId": "L", "name": "La Pampa" },{ "stateId": "F", "name": "La Rioja" },{ "stateId": "M", "name": "Mendoza" },{ "stateId": "N", "name": "Misiones" },{ "stateId": "Q", "name": "Neuquen" },{ "stateId": "R", "name": "Rio Negro" },{ "stateId": "A", "name": "Salta" },{ "stateId": "J", "name": "San Juan" },{ "stateId": "D", "name": "San Luis" },{ "stateId": "Z", "name": "Santa Cruz" },{ "stateId": "S", "name": "Santa Fe" },{ "stateId": "G", "name": "Santiago del Estero" },{ "stateId": "V", "name": "Tierra del Fuego" },{ "stateId": "T", "name": "Tucuman" }]}';	
	this.states = JSON.parse(this.texto).states;
 	var user = readCookie("user");
 	var token = readCookie("token");
 	var focus = this;
 	$scope.dirId = {};
 	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username="+user +"&authentication_token="+token).then(function(res){
 		$scope.user = res.data.account;
 		$scope.user.identityCard = parseInt($scope.user.identityCard);
 		focus.DOB = $scope.user.birthDate.split('-');
 		$log.debug($scope.user.gender);
 		$log.debug(user);
 		$log.debug(token);
 		$log.debug(res.data);
 	});
 	$scope.loadAddresses = function(){
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username="+ user +"&authentication_token="+token).then(function(res){
	 		$scope.direcciones = res.data.addresses; // Fijarse que solo devuelve 8, ya que esta pensado para que haya muchas paginas de direcciones
 			$log.debug($scope.direcciones);
 			for(i in $scope.direcciones){
 				$scope.dirId[$scope.direcciones[i].id] = $scope.getProvinceById($scope.direcciones[i].province);
 			}
 		});
 	}
 	$scope.loadAddresses();
 	$scope.getProvinceById = function(id){
 			for(i=0;i<focus.states.length;i++){
	 			if(focus.states[i].stateId == id){
 					return focus.states[i].name;
 				}
 			}
 	};
	$scope.saveAddress = function(){
 		var name = '"name":"' + $scope.IdName + '"';
 		var street = ',"street":"' + $scope.street + '"';
 		var number = ',"number":"' + $scope.number + '"';
 		var floor = ($scope.floor === undefined)?"":',"floor":"' + $scope.floor + '"';
 		var gate = ($scope.gate === undefined)?"":',"gate":"' + $scope.dpto + '"';
 		var zipCode = ',"zipCode":"' + $scope.postalCode + '"';
 		var province = ',"province":"' + $scope.province + '"';
 		var city = ($scope.province === 'C')?"":',"city":"' + $scope.city + '"';
 		var phoneNumber = ',"phoneNumber":"' + $scope.telephone + '"';

 		var address ='{'+name+street+number+floor+gate+zipCode+province+city+phoneNumber+'}';
 		$log.debug("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ address);
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ address).then(function(res){
 			$log.debug(res);

 		});
 	}
 	$scope.isAddress= function(){
 		return ($scope.direcciones == undefined || $scope.direcciones.length == 0);
 	}
 	this.removeAddress = function(id){
 		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteAddress&username='+ readCookie("user") + '&authentication_token='+ readCookie("token") +'&id=' + id).then(function(res){
 			$log.debug(res);
 			if(res.data.error === undefined){
 				for(i = 0; i< $scope.direcciones.length;i++){
 					if($scope.direcciones[i].id === id){
 						$scope.direcciones.splice(i,1);
 					}
 				}
 			}
 		});
 	}
 	this.editAddress = function(id){
 		for(i = 0; i< $scope.direcciones.length;i++){
 			if($scope.direcciones[i].id === id){
 				var selected = $scope.direcciones[i];
 			}
 		}
 		this.name = selected.name;
 		this.number = selected.number;
 		this.phoneNumber = selected.phoneNumber;
 		this.province = selected.province;
 		this.street = selected.street;
 		this.zipCode = selected.zipCode;
 		this.floor = selected.floor;
 		this.gate = selected.gate;

 	}
 	this.dayValidator = function(){
		if(this.DOB[2] !== undefined){
			if(this.DOB[2].length == 1){
				if(isPositiveInteger(this.DOB[2])){
					if(this.DOB[2] > 3){
						this.DOB[2] = '0' + this.DOB[2];
						$('#month').focus();
					}
				}else{
					this.DOB[2]=last;
				}
			}else if( this.DOB[2].length >= 2){
				if(isPositiveInteger(this.DOB[2]) && this.DOB[2] <= 31){
					$('#month').focus();
				}else{
					this.DOB[2] = last;
				}

			}
		}
		last = this.DOB[2];
	}

	this.monthValidator = function(){
		if(this.DOB[1] !== undefined){
			if(this.DOB[1].length == 1){
				if(isPositiveInteger(this.DOB[1])){
					if(this.DOB[1] > 1){
						this.DOB[1] = '0' + this.DOB[1];
						$('#year').focus();
					}
				}else{
					this.DOB[1]=lastM;
				}
			}else if( this.DOB[1].length >= 2){
				if(isPositiveInteger(this.DOB[1]) && this.DOB[1] <= 12){
					$('#year').focus();
				}else{
					this.DOB[1] = lastM;
				}

			}
		}
		lastM = this.DOBMonth;
	}

	this.yearValidator = function(){
		if(this.DOB[0] !== undefined && (!isPositiveInteger(this.DOB[0]) || this.DOB[0] > 2000) ){
			this.DOB[0] = last;
		}
		last = this.DOB[0];
	}

	this.isValid = function(user){
		if(user === undefined){
			return false;
		}
		if(user.email === undefined || user.email.indexOf('@') == -1 || user.email.indexOf('.') == -1 ||  user.email.lastIndexOf('.') - user.email.indexOf('@') < 2){
			return false;
		}
		
		$('#email').parent().addClass('has-success');
		if(user.firstName === undefined || user.firstName.length > 80 || user.lastName === undefined || user.lastName.length > 80){
			return false;
		}
		
		$('#firstname').parent().addClass('has-success');
		$('#lastname').parent().addClass('has-success');
		if(user.gender !== 'M' && user.gender !== 'F'){
			return false;
		}
		
		if(!isPositiveInteger(user.identityCard) || user.identityCard.length > 10){
			return false;
		}
		
		if(this.DOB[2] === undefined || this.DOB[1] === undefined || this.DOB[0] === undefined){
			return false;
		}
		if(this.DOB[0] !== undefined && this.DOB[0] < 1900){
			$('#year').popover('show');
			return false;
		}
		
		$('#year').popover('hide');
		$('#year').parent().parent().parent().addClass('has-success');
		return true;
	}
	
	this.updateAccount = function(user){
		var account = '{"firstName":"'+user.firstName+'","lastName":"'+user.lastName+'","gender":"'+user.gender+'","identityCard":"'+user.identityCard+'","email":"'+user.email+'","birthDate":"'+this.DOB[0] +'-'+ this.DOB[1] +'-'+ this.DOB[2]+'"}';
		$log.debug('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAccount&username=' + readCookie("user") + '&authentication_token='+readCookie("token") +'&account='+ account);
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAccount&username=' + readCookie("user") + '&authentication_token='+readCookie("token") +'&account='+ account).then(function(res){
			$log.debug(res);
		});
	}
	this.saveState = function(user){
		$scope.saved = {};
		$scope.saved.fistName = user.firstName;
		$scope.saved.lastName = user.lastName;
		$scope.saved.email = user.email;
		$scope.saved.identityCard = user.identityCard;
		$scope.saved.gender = user.gender;
		$scope.saved.birthDate = user.birthDate;
	};
	this.descartar = function(user){
		user.firstName = $scope.saved.fistName ;
		user.lastName = $scope.saved.lastName ;
		user.email = $scope.saved.email;
		user.identityCard = $scope.saved.identityCard;
		user.gender = $scope.saved.gender;
		user.birthDate = $scope.saved.birthDate;
	}
 });
 app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

})();

	function isPositiveInteger(n) {
    return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}
function readCookie(name) {
    return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
}