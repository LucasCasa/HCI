(function() {
var app = angular.module('Carrito', ['navbar']);
 app.controller('TalleController',function(){
 	this.talles = talles;
 	this.setTalle = function(talle){
 		
 	}
 });
 app.controller('ColorController',function($scope){
 	this.colores = colores;
 	this.setColor = function(talle){
 		$scope.colordd = talle;
 	}
 });
 app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
 app.controller('CarritoController',function($scope,$http,$log){	
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=3").then(function(res){
		$scope.productos = res.data.products;
		$scope.total = 0;
		res.data.products.forEach(function(entry){
			$scope.total+= entry.price;
		})

	});
});

 app.controller('AmountController',function($scope){
 	$scope.selected = 1;
	this.add = function(value){
		$scope.selected = parseInt($scope.selected) + value;
		if($scope.selected < 1)
			$scope.selected = 1;
		$scope.$apply();
	};
 });

 var talles = ['S','M','L','XL'];
 var colores = ['Amarillo','Verde','Azul','Rojo'];
})();

$(document).on('click', '.dropdown-menu li a', function(){
    //$(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
    $(this).closest(".btn-group").find("button").text($(this).text());
});

$(document).on('click', '.btn-rmv',function(){
	$(this).closest("tr").remove();
});