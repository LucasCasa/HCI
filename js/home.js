(function(){
	var app = angular.module('home',['navbar','footer']);

app.controller('DestacadosController',function($scope,$http,$log){	
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=1").then(function(res){
		$scope.destacados = res.data.products;
	});
});
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

})();