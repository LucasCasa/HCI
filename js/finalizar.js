(function() {
var app = angular.module('Finalizar', []);

app.filter('tarjeta',function(){
 	return function(input){
 		return (input===undefined)?"":input.slice(0,5) + ' **** **** ' + input.slice(input.length - 4);
 	}
});

app.controller('FinalizarController',function($scope,$http,$log){
	this.texto = '{"states": [ { "stateId": "C", "name": "Ciudad Autonoma de Buenos Aires" }, { "stateId": "B", "name": "Buenos Aires" }, { "stateId": "K", "name": "Catamarca" }, { "stateId": "H", "name": "Chaco" }, { "stateId": "U", "name": "Chubut" }, { "stateId": "X", "name": "Cordoba" }, { "stateId": "W", "name": "Corrientes" },{ "stateId": "E", "name": "Entre Rios" },{ "stateId": "P", "name": "Formosa" },{ "stateId": "Y", "name": "Jujuy" },{ "stateId": "L", "name": "La Pampa" },{ "stateId": "F", "name": "La Rioja" },{ "stateId": "M", "name": "Mendoza" },{ "stateId": "N", "name": "Misiones" },{ "stateId": "Q", "name": "Neuquen" },{ "stateId": "R", "name": "Rio Negro" },{ "stateId": "A", "name": "Salta" },{ "stateId": "J", "name": "San Juan" },{ "stateId": "D", "name": "San Luis" },{ "stateId": "Z", "name": "Santa Cruz" },{ "stateId": "S", "name": "Santa Fe" },{ "stateId": "G", "name": "Santiago del Estero" },{ "stateId": "V", "name": "Tierra del Fuego" },{ "stateId": "T", "name": "Tucuman" }]}';	
	$scope.states = JSON.parse(this.texto).states;
	$scope.costoEnvio = 20;
	var fucus = this;
	$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllCreditCards&username='+ readCookie("user") +'&authentication_token=' + readCookie("token") + '&page_size=999').then(function(res){
			$scope.tarjetas = res.data.creditCards;
	});
	$scope.getCardType = function(number){
		if(number.substr(0,1) == 4){
			return "Visa"
		}else if(number.substr(0,1) == 5){
			return "MasterCard"
		}else if(number.substr(1,1) == 6){
			return "Diners"
		}else{
			return "AmericanExpress"
		}
	}
	$scope.getProvince = function(id){
 			for(i=0;i<$scope.states.length;i++){
	 			if($scope.states[i].stateId == id){
 					return $scope.states[i].name;
 				}
 			}
 	};
	$scope.GetOrderById = function(){
		$loadingO = true;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+readCookie("user") +'&authentication_token='+readCookie("token")+'&id='+readCookie("carritoOrderId")).then(function(res){
			$log.debug(res);
			$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAddressById&username='+readCookie('user')+'&authentication_token='+readCookie("token") + '&id='+ res.data.order.address.id).then(function(res2){
				$loadingO = false;
				$log.debug(res2);
				$scope.direccion = res2.data.address;
			});
		});
	}
	this.comprar = function(){
		var credit = ($scope.card)?',"creditCard":{"id": '+$scope.selectedCard +'}':"";
		var order = '{"id":'+readCookie("carritoOrderId") + ',"address":{"id":'+ $scope.direccion.id + '}'+credit+'}';
		$log.debug('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ConfirmOrder&username='+readCookie("user")+'&authentication_token='+readCookie("token")+'&order=' + order);
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ConfirmOrder&username='+readCookie("user")+'&authentication_token='+readCookie("token")+'&order=' + order).then(function(res){
			$log.debug("Comprado??");
			$log.debug(res);

		});

	}
	$scope.updateItems = function(){
		$scope.loading = true;
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="+readCookie("user")+"&authentication_token="+readCookie("token")+"&id="+readCookie("carritoOrderId")).then(function(res){
			$scope.total = 0;
			$scope.productos = res.data.order.items;
			$scope.total += $scope.costoEnvio;
			$scope.productos.forEach(function(entry){
					$scope.total += entry.price;
			});
			$scope.loading = false;
		});
	}
	$scope.updateTotal= function(){
		$scope.total = 0;
		if($scope.productos !== undefined){
			$scope.productos.forEach(function(entry){
				$scope.total += entry.price;
			});
			$scope.total+=$scope.costoEnvio;
		}
	};
	$scope.removeItem = function(id){
		for(i in $scope.productos){
			if($scope.productos[i].id == id){
				$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username='+ readCookie("user")+'&authentication_token='+readCookie("token") +'&id='+ id).then(function(res){
					$log.debug(res);
					$log.debug("Borrada?");
				});
				$scope.productos.splice(i,1);
			}
		}
		$scope.updateTotal();
	}
	$('#finaliz').on('click', function() {
		$log.debug($scope);
		$scope.GetOrderById();
    	$scope.updateItems();
 	});
});



})();

function readCookie(name) {
    return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
}

