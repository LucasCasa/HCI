(function() {
var app = angular.module('Carrito', []);
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

 var talles = ['S','M','L','XL'];
 var colores = ['Amarillo','Verde','Azul','Rojo'];
})();

 $(".dropdown-menu").on('click', 'li a', function(){
        $(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
        $(this).parent().parent().siblings(".btn:first-child").val($(this).text());
    });