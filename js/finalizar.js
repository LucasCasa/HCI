(function() {
var app = angular.module('Finalizar', []);

app.controller('FinalizarController',function($scope,$http,$log){
	$scope.costoEnvio = 20;
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=3").then(function(res){
		$scope.productos = res.data.products;
		$scope.total = 0;
		res.data.products.forEach(function(entry){
			$scope.total+= entry.price;
		});
		$scope.total += $scope.costoEnvio;
	});
});

})();