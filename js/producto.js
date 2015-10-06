(function(){
var app = angular.module('productoApp',[]);
var producto = {};
app.controller('ProductController',function($scope,$http,$log){
var prodId = parent.document.URL.substring(parent.document.URL.indexOf('?') + 4, parent.document.URL.length);
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + prodId).then(function(res){
		$scope.producto = res.data.product;
		$log.debug(res);
		$log.debug(prodId);
	});
});


})();