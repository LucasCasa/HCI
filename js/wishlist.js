(function(){ 
var app = angular.module('wishlist',['navbar']);

 app.controller('WishlistController',function($scope,$http,$log){	
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=2").then(function(res){
		$scope.productos = res.data.products;
	});
});
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
 	return{restrict: 'E',templateUrl: "nav.html"};
 });
 var talles = ['S','M','L','XL'];
 var colores = ['Amarillo','Verde','Azul','Rojo'];
})();


$(document).ready(function(){
	$("tbody").on("click",".btn-rmv",function(){
		$(this).closest("tr").remove();
	});
});
