(function() {
var app = angular.module('Finalizar', []);

app.controller('FinalizarController',function($scope,$http,$log){
	$scope.costoEnvio = 20;
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="+readCookie("user")+"&authentication_token="+readCookie("token")+"&id="+readCookie("carritoOrderId")).then(function(res){
		$scope.productos = res.data.order.items;
		$scope.total = 0;
		res.data.products.forEach(function(entry){
			$scope.total+= entry.price;
		});
		$scope.total += $scope.costoEnvio;
	});
});

})();

function readCookie(name) {
    return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
}