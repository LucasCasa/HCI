(function() {
var app = angular.module('search', ['navbar']);


app.controller('BusquedaController',function($scope,$http,$log){
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=1").then(function(res){
		$scope.destacados = res.data.products;
	});
});
})();
