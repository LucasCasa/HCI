(function() {
var app = angular.module('Cuenta', ['navbar','ngAnimate','footer']);

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
 	}
 	});
 	app.directive('customFooter',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "footer.html"
 	}
 	});
 app.filter('tarjeta',function(){
 	return function(input){
 		return (input===undefined)?"":input.slice(0,4) + ' **** **** ' + input.slice(input.length-4)
 	}
 });
   app.directive('addCreditcard',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "add-creditCard.html"
 	};

 });
  app.directive('addAddress',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "add-address.html"
 	};

 });
    app.directive('modifyPassword',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "modify-password.html"
 	};

 });
     app.directive('modifyAccount',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "modify-account.html"
 	};

 });
 app.filter('fecha',function(){
 	return function(input){
 		return input.substr(0,2) + "/" + input.substr(2,2);
 	}
 });

 app.controller("CuentaController",function($http,$log,$scope){
 	this.texto = '{"states": [ { "stateId": "C", "name": "Ciudad Autonoma de Buenos Aires" }, { "stateId": "B", "name": "Buenos Aires" }, { "stateId": "K", "name": "Catamarca" }, { "stateId": "H", "name": "Chaco" }, { "stateId": "U", "name": "Chubut" }, { "stateId": "X", "name": "Cordoba" }, { "stateId": "W", "name": "Corrientes" },{ "stateId": "E", "name": "Entre Rios" },{ "stateId": "P", "name": "Formosa" },{ "stateId": "Y", "name": "Jujuy" },{ "stateId": "L", "name": "La Pampa" },{ "stateId": "F", "name": "La Rioja" },{ "stateId": "M", "name": "Mendoza" },{ "stateId": "N", "name": "Misiones" },{ "stateId": "Q", "name": "Neuquen" },{ "stateId": "R", "name": "Rio Negro" },{ "stateId": "A", "name": "Salta" },{ "stateId": "J", "name": "San Juan" },{ "stateId": "D", "name": "San Luis" },{ "stateId": "Z", "name": "Santa Cruz" },{ "stateId": "S", "name": "Santa Fe" },{ "stateId": "G", "name": "Santiago del Estero" },{ "stateId": "V", "name": "Tierra del Fuego" },{ "stateId": "T", "name": "Tucuman" }]}';	
	this.states = JSON.parse(this.texto).states;
 	var user = readCookie("user");
 	var token = readCookie("token");
 	var focus = this;
 	$scope.dirId = {};
 	$scope.loadingU = true;
 	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username="+user +"&authentication_token="+token).then(function(res){
 		$scope.user = res.data.account;
 		$scope.user.identityCard = parseInt($scope.user.identityCard);
 		focus.DOB = $scope.user.birthDate.split('-');
 		$log.debug($scope.user.gender);
 		$log.debug(user);
 		$log.debug(token);
 		$log.debug(res.data);
 		$scope.loadingU = false;
 	});
 	//Direcciones
 	$scope.loadAddresses = function(){
 		$scope.loadingA = true;
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username="+ user +"&authentication_token="+token + "&page_size=9999").then(function(res){
	 		$scope.direcciones = res.data.addresses; // Fijarse que solo devuelve 8, ya que esta pensado para que haya muchas paginas de direcciones
 			$log.debug($scope.direcciones);
 			for(i in $scope.direcciones){
 				$scope.dirId[$scope.direcciones[i].id] = $scope.getProvinceById($scope.direcciones[i].province);
 			}
 			$scope.loadingA = false;
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
		$scope.loadingSA = true;
 		$log.debug("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ focus.createAddressString(undefined));
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ focus.createAddressString(undefined)).then(function(res){
 			$log.debug(res);
 			$scope.loadingSA = false;
 		});
 	}
 	this.createAddressString = function(id){
 		var idstr = ""
 		if(id !== undefined){
 			var idstr = '"id":' + id + ',';
 		}
 		var name = '"name":"' + $scope.IdName + '"';
 		var street = ',"street":"' + $scope.street + '"';
 		var number = ',"number":"' + $scope.number + '"';
 		var floor = ($scope.floor === undefined)?"":',"floor":"' + $scope.floor + '"';
 		var gate = ($scope.dpto === undefined)?"":',"gate":"' + $scope.dpto + '"';
 		var zipCode = ',"zipCode":"' + $scope.postalCode + '"';
 		var province = ',"province":"' + $scope.province + '"';
 		var city = ($scope.province === 'C')?"":',"city":"' + $scope.city + '"';
 		var phoneNumber = ',"phoneNumber":"' + $scope.telephone + '"';

 		return '{'+idstr+name+street+number+floor+gate+zipCode+province+city+phoneNumber+'}';

 	}
 	$scope.updateAddress = function(){
 		$scope.loadingUA = true;
 		$log.debug("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAddress&username="+user+"&authentication_token="+token+"&address="+ focus.createAddressString($scope.addressId));
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAddress&username="+user+"&authentication_token="+token+"&address="+ focus.createAddressString($scope.addressId)).then(function(res){
 			if(res.data.error === undefined){
 				$scope.loadAddresses();
 			}
 			$scope.loadingUA  = false;

 		});

 	}	
 	$scope.isAddress= function(){
 		return ($scope.direcciones == undefined || $scope.direcciones.length == 0);
 	}
 	this.isValidAddress = function(){
		if($scope.IdName === undefined || $scope.IdName === ""){
			return false;
		}
		if($scope.street === undefined || $scope.street === ""){
			return false;
		}
		if($scope.number === undefined || !isPositiveInteger($scope.number)){
			return false;
		}
		if($scope.province === undefined){
			return false;
		}
		if($scope.province !== 'C' && ($scope.city === undefined || $scope.city === "")){
			return false;
		}
		if($scope.postalCode === undefined || !isPositiveInteger($scope.postalCode)){
			return false;
		}
		if($scope.telephone === undefined || $scope.telephone === ""){
			return false;
		}
		return true;
	}
	
 	this.removeAddress = function(id){
 		$scope.loadingRA = true;
 		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteAddress&username='+ readCookie("user") + '&authentication_token='+ readCookie("token") +'&id=' + id).then(function(res){
 			$log.debug(res);
 			$scope.loadingRA = false;
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
 		for(i in $scope.direcciones){
 			if($scope.direcciones[i].id === id){
 				var selected = $scope.direcciones[i];
 			}
 		}
 		$scope.addressId = id;
 		$scope.IdName = selected.name;
 		$scope.number = selected.number;
 		$scope.telephone = selected.phoneNumber;
 		$scope.province = selected.province;
 		$scope.city = selected.city;
 		$scope.street = selected.street;
 		$scope.postalCode = selected.zipCode;
 		$scope.floor = selected.floor;
 		$scope.dpto = selected.gate;

 	}
 	//Información Personal
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
			if($('#email').hasClass('ng-dirty')){
				$('#email').parent().addClass('has-error');
			}
			return false;
		}
		
		$('#email').parent().addClass('has-success');
		$('#email').parent().removeClass('has-error');
		if(user.firstName === undefined || user.firstName.length > 80 ){
			if($('#firstname').hasClass('ng-dirty')){
				$('#firstname').parent().addClass('has-error');
			}
			return false;
		}
		$('#firstname').parent().addClass('has-success');
		$('#firstname').parent().removeClass('has-error');
		if(user.lastName === undefined || user.lastName.length > 80){

			if($('#lastname').hasClass('ng-dirty')){
				$('#lastname').parent().addClass('has-error');
			}
			return false;
		}
		$('#lastname').parent().removeClass('has-error');
		$('#lastname').parent().addClass('has-success');
		if(user.gender !== 'M' && user.gender !== 'F'){
			return false;
		}
		
		if(!isPositiveInteger(user.identityCard) || Math.log(user.identityCard + 1) / Math.LN10 > 10){
			if($('#dni').hasClass('ng-dirty')){
				$('#dni').parent().addClass('has-error');
			}
			return false;
		}
		$('#dni').parent().addClass('has-success');
		$('#dni').parent().removeClass('has-error');
		if(this.DOB[2] === undefined || this.DOB[1] === undefined || this.DOB[0] === undefined){

			return false;
		}
		if(this.DOB[0] !== undefined && this.DOB[0] < 1900){
			if($('#year').hasClass('ng-dirty')){
				$('#year').popover('show');
				$('#year').parent().parent().parent().addClass('has-error');
			}
			return false;
		}
		$('#year').popover('hide');
		$('#year').parent().parent().parent().addClass('has-success');
		$('#year').parent().parent().parent().removeClass('has-error');
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
	}
	this.descartar = function(user){
		user.firstName = $scope.saved.fistName ;
		user.lastName = $scope.saved.lastName ;
		user.email = $scope.saved.email;
		user.identityCard = $scope.saved.identityCard;
		user.gender = $scope.saved.gender;
		user.birthDate = $scope.saved.birthDate;
	}

	//Tarjetas
	$scope.isCard= function(){
 		return ($scope.tarjetas == undefined || $scope.tarjetas.length == 0);
 	}
	this.editCard = function(id){
 		for(i = 0; i< $scope.tarjetas.length;i++){
 			if($scope.tarjetas[i].id === id){
 				var selected = $scope.tarjetas[i];
 			}
 		}
 		this.cardNumber = selected.cardNumber;
 		this.expirationDate = selected.expirationDate;
 		this.securityCode = selected.securityCode;

 	}
 	this.removeCard = function(id){
 		$scope.loadngRC = true;
 		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteCreditCard&username='+ user + '&authentication_token='+ token +'&id=' + id).then(function(res){
 			$log.debug(res);
 			$scope.loadngRC = false;
 			if(res.data.error === undefined){
 				for(i = 0; i< $scope.tarjetas.length;i++){
 					if($scope.tarjetas[i].id === id){
 						$scope.tarjetas.splice(i,1);
 					}
 				}
 			}
 		});
 	}
 	$scope.saveCard = function(){
 		var number = '"number":"' + $scope.cardNumber + '"';
 		var expDate = ',"expirationDate":"' + $scope.expirationDate + '"';
 		var secCode = ',"securityCode":"' + $scope.securityCode + '"';
 		var card = '{'+number+expDate+secCode+'}';
 		$scope.loadingSC = true;
 		$log.debug("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateCreditCard&username=" +user+"&authentication_token="+token+"&credit_card=" + card);
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateCreditCard&username="+user+"&authentication_token="+token+"&credit_card="+ card).then(function(res){
 			$log.debug(res);
 			$scope.loadingSC = false;
 			if(res.data.error === undefined){
 				$scope.errorCard = false;
 				$('#addCardModal').modal('toggle');
 				$scope.loadCard();

 			}else{
 				$scope.errorCard = true;
 			}	
 		});
 	}
 	this.updateCard = function(tarjeta){
 		$scope.loadingUC = true;
 		var idCard = '"id":' + tarjeta.id;
		var number = ',"number":"' + tarjeta.cardNumber + '"';
 		var expDate = ',"expirationDate":"' + tarjeta.expirationDate + '"';
 		var secCode = ',"securityCode":"' + tarjeta.securityCode + '"';
 		var card = '{'+idCard+number+expDate+secCode+'}';
		$log.debug('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateCreditCard&username=' + user + '&authentication_token='+ token +'&credit_card='+ card);
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateCreditCard&username=' + user + '&authentication_token='+ token +'&credit_card='+ card).then(function(res){
			$log.debug(res);
			$scope.loadingUC = false;
			$scope.loadCard();
		});
	}
	this.isValidCard = function(){
		if($scope.cardNumber === undefined || $scope.cardNumber === ""){
			$scope.selectedCard = "";
			return false;
		}
		if(!isPositiveInteger($scope.cardNumber) || !isValidCardNumber($scope.cardNumber)){
			return false;
		}
		if($scope.expirationDate === undefined || $scope.expirationDate === "" ||  !isPositiveInteger($scope.expirationDate) || !isValidExpDate($scope.expirationDate)){
			return false;
		}
		if($scope.securityCode === undefined || $scope.securityCode === "" ||!isPositiveInteger($scope.securityCode) || !isValidSecurityCode($scope.securityCode,$scope.selectedCard)){
			return false;
		}

		return true;
	}
	$scope.getCardImage = function(number){
		if(number.substr(0,1) == 4){
			return "images/visa.png"
		}else if(number.substr(0,1) == 5){
			return "images/master.png"
		}else if(number.substr(1,1) == 6){
			return "images/diners.png"
		}else{
			return "images/amex.png"
		}
	}
 	$scope.loadCard = function(){
 		$scope.loadingLC = true;
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllCreditCards&username="+ user +"&authentication_token="+token+"&page_size=9999").then(function(res){
	 		$scope.tarjetas = res.data.creditCards; // Fijarse que solo devuelve 8, ya que esta pensado para que haya muchas paginas de direcciones
 			$log.debug($scope.tarjetas);
 			$scope.loadingLC = false;
 		});
 	}
 	$scope.loadCard();

 	//Historial de compras
 	$scope.isOrder= function(){
 		return ($scope.compras == undefined || $scope.compras.length == 0);
 	}

 	$scope.loadAllOrders = function(){
 		$scope.loadingAO = true;
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username="+ user +"&authentication_token="+token+"&page_size=9999").then(function(res){
	 		$scope.compras = res.data.orders; 
 			$log.debug($scope.compras);
 			$scope.loadingAO = false;
 		});
 	}
 	$scope.loadAllOrders();

 	$scope.loadOrder = function(idOrder){
 		$scope.loadingO = true;
 		$('#viewOrderModal2').modal('toggle');
 		$log.debug('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+ user + '&authentication_token=' + token + '&new_password=' + idOrder);
 		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+ user +'&authentication_token=' + token + '&id=' + idOrder).then(function(res){
 			console.log($('#viewOrderModal2'));
 
 			$scope.order = res.data.order;
 			$log.debug($scope.order);
 			$scope.loadingO = false;
 		});
 	}

 	$scope.orderPrice = function(){
 		var precio = 0;
 		if($scope.order !== undefined){
 		for (var i = 0; i < $scope.order.items.length; i++) {
 			precio += ($scope.order.items[i].price*$scope.order.items[i].quantity);
 		};
 		}
 		return precio;
 	}

 	 $scope.orderQty = function(){
 	 	if($scope.order !== undefined){
 		return $scope.order.items.length;
 		}
 		return 0;
 	}

 	//Cambio de contraseña
 	$scope.updatePass = function(){
 		$scope.updatePW = true;
 		$scope.invalidOldPass = false;
 		$log.debug('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=ChangePassword&username='+ user + '&password=' + $scope.oldpass + '&new_password=' + $scope.newpass);
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=ChangePassword&username='+ user + '&password=' + $scope.oldpass + '&new_password=' + $scope.newpass).then(function(res){
			$log.debug(res);
			if(res.data.error !== undefined){
				if(res.data.error.code == 101 || res.data.error.code == 105){
					$scope.invalidOldPass = true;
				}
			}else{
					$('#modifyPassModal').modal('toggle');
			}
			$scope.updatePW = false;
		});
 	}

 	this.isValidPass = function(){
 		if($scope.oldpass === undefined || $scope.oldpass === ""){
 			return false;
 		}
 		if($scope.newpass === undefined || $scope.newpass === "" || $scope.newpass.length < 8 || $scope.newpass.length > 15){
 			return false;
 		}
 		if($scope.repnewpass === undefined || $scope.repnewpass === "" || $scope.repnewpass.length < 8 || $scope.repnewpass.length > 15 || $scope.repnewpass != $scope.newpass){
 			return false;
 		}
 		return true;
 	}
 	function isValidCardNumber(number){
	if(number.charAt(0) === '3' && (number.charAt(1) === '4' || number.charAt(1)=== '7')){
		$scope.selectedCard = "Amex";
		if(number.length === 15){
			return true;
		}
	}
	if(number.charAt(1) === '6'){
		$scope.selectedCard = "Diners";
		if(number.length === 14 && number.charAt(0) === '3'){	
		return true;
		}
	}
	if(number.charAt(0) === '4'){
		$scope.selectedCard = "Visa";
		if((number.length === 16 || number.length === 13)){
			return true;
		}
	}
	if(number.charAt(0) === '5' && (number.charAt(1) === '1' || number.charAt(1) === '2' || number.charAt(1) === '3')){
		$scope.selectedCard = "Master";
		if(number.length === 16){
			return true;
		}
	}
	return false;
}

 });
 app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

})();

function isPositiveInteger(n) {
	if(n === undefined){
		return false;
	}
   	for(i in n.length){
   		if(isNaN(n.substr(i,1).parseInt)){return false}
   	}
   return true;
}
function readCookie(name) {
    return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
}


function isValidSecurityCode(code,brand){
	if(brand === "Amex" && code.length === 4){
		return true;
	}
	if((brand === "Visa" || brand === "Master" || brand === "Diners") && code.length === 3){
		return true;
	}
	return false;
}

function isValidExpDate(date){
	if(date.length === 4 && parseInt(date.substr(0,2)) > 0 && parseInt(date.substr(0,2)) < 13){
		return true;
	}
	return false;
}

window.onload = function(){  

    var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
    }

    //Change hash for page-reload
    $('.nav-tabs a[href=#' + url.split('#')[1] + ']').on('shown', function (e) {
        window.location.hash = e.target.hash;
    }); 
}
