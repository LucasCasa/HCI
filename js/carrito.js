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
 $scope.selected = {};	
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=3").then(function(res){
		$scope.productos = res.data.products;
		$scope.total = 0;
		res.data.products.forEach(function(entry){
			$scope.total += entry.price;
			$scope.selected[entry.id] = 1;
		})

	});
	this.updateTotal= function(){
		$scope.total = 0;
		if($scope.productos !== undefined){
		$scope.productos.forEach(function(entry){
			$scope.total += entry.price * $scope.selected[entry.id];
		});
		}
		};
	this.add = function(value,id){
		$scope.selected[id] = parseInt($scope.selected[id]) + value;
		if($scope.selected[id] < 1)
			$scope.selected[id] = 1;
		this.updateTotal();
		};
		
 });

 var talles = ['S','M','L','XL'];
 var colores = ['Amarillo','Verde','Azul','Rojo'];
})();

$(document).on('click', '.dropdown-menu li a', function(){
    //$(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
    $(this).closest(".btn-group").find("button").text($(this).text());
});
/*
$(document).on('click', '.btn-rmv',function(){
	var row = $(this).closest("tr");            // find parent tr
    var index = $("table").find(row).index() + 1;    // get index of tr
	$(this).closest("tr").remove();
	$(document).find(".infoblock h5:nth-child(" + index + ")").remove();
});*/