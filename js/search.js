(function() {
var app = angular.module('search', ['navbar']);



app.controller('BusquedaController',function($scope,$http,$log,$location){

	//$locationProvider.html5Mode(true);


	 $scope.loading = true;
		var onSuccess = function(res){
		$scope.destacados = res.data.products;
		$scope.loading = false;

		}

	var onErrorOcurred= function(res){
		$scope.error = "Error";
	}
	var url = window.location.href;
	console.log(url);
	var urlArray = url.split("/");
	var pos = urlArray.length;

	url = urlArray[pos-1];
	console.log(url);

	var param = (url.split("?")[1]).split("&");

	var nombre = param[0].split("=")[1];
	var categ = param[1].split("=")[1];

	console.log(nombre);
	console.log(categ);



	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByName&name="+nombre).then(onSuccess,onErrorOcurred);


})

})();
