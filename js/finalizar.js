(function() {
var app = angular.module('Finalizar', []);

app.filter('tarjeta',function(){
 	return function(input){
 		return (input===undefined)?"":input.slice(0,5) + ' **** **** ' + input.slice(input.length - 4);
 	}
});

app.controller('FinalizarController',function($scope,$http,$log){
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
    	$scope.updateItems();
 	});
});



})();

function readCookie(name) {
    return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
}

