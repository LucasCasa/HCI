(function(){
var app = angular.module('productoApp',['navbar']);

app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
app.controller('ProductController',function($scope,$http,$log){
	var prodId = parent.document.URL.substring(parent.document.URL.indexOf('?') + 4, parent.document.URL.length);
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + prodId).then(function(res){
		$scope.producto = res.data.product;
		$log.debug(res);
		$log.debug(prodId);
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

 var talles = ['S','M','L','XL'];
 var colores = ['Amarillo','Verde','Azul','Rojo'];

app.controller('ReviewController',function($scope,$http,$log){
	this.commenting = false;
	this.reviews = comments;
	$scope.range = function(n) {
        return new Array(n);
    };
    this.toggleCommenting = function(){
    	this.commenting = !this.commenting;
    };
});

var comments = [{
    stars: 5,
    body: "Mejor alpargata ever",
    author: "mvega@itba.edu.ar",
  }, {
    stars: 1,
    body: "Viene con agujeros",
    author: "cupcake@nana.com",
  }];

})();