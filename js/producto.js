(function(){
var app = angular.module('productoApp',['navbar'])
    /*.service('shared', function () {
          var selectedTalle = undefined;
          var selectedColor = undefined;
          var selectedAmount  = 1;
          return {
              getSelectedTalle: function () {
                  return selectedTalle;
              },
              setSelectedTalle: function(value) {
                  selectedTalle = value;
              },
              getSelectedColor: function () {
                  return selectedColor;
              },
              setSelectedColor: function(value) {
                  selectedColor = value;
              },
              getSelectedAmount: function () {
                  return selectedAmount;
              },
              setSelectedAmount: function(value) {
                  selectedAmount = value;
              },
          };
      })*/;

app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
app.controller('ProductController',function($scope,$http,$log){
  var cookie = document.cookie;
  var user = ReadCookie("user");
  var token = ReadCookie("token");
	this.prodId = parent.document.URL.substring(parent.document.URL.indexOf('?') + 4, parent.document.URL.length);
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + this.prodId).then(function(res){
		$scope.producto = res.data.product;
		$log.debug(res);
		$log.debug(this.prodId);
	});
  $scope.loading = false;
  $scope.cartBtn = "";
  $scope.selectedAmount = 1;
	this.selected = 1;
	this.select = function(value){
		this.selected = value;
	};
  this.addToCart = function(){
    $scope.loading = true;
    if(ReadCookie("carritoOrderId")==null){
      $http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + user + "&authentication_token=" + token).then(function(res){
        $log.debug(res);
        document.cookie="carritoOrderId=" + res.data.order.id + "; path=/";
        this.addWithOrder();
        alert("crea uno nuevo");
      });
    }else{
      this.addWithOrder();
    }
  };
  this.addWithOrder = function(){
    var orderID = ReadCookie("carritoOrderId");
    $http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=' + user + '&authentication_token=' + token + '&order_item={"order":{"id":' + orderID + '},"product":{"id": ' + this.prodId + '},"quantity":'+ $scope.selectedAmount +'}').then(function(res){
      $log.debug('quantity: ' + $scope.selectedAmount);
      $log.debug('token: ' + token);
      $log.debug('orderID: ' + orderID);
      $log.debug(res);
      $scope.cartBtn = "disabled";
      $(document).find("#btn-cart").html("<span class=\"glyphicon glyphicon-ok\"></span> Agregado");
    });
  }
});
 app.controller('TalleController',function($scope){
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
 app.controller('AmountController',function($scope){
 	this.add = function(value){
 		$scope.selectedAmount = parseInt($scope.selectedAmount) + value;
 		if($scope.selectedAmount < 1)
 			$scope.selectedAmount = 1;
 	};
 })

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
  },{
  	stars:4,
  	body: "Increible, pero me lo comi todo",
  	author: "homero@simpson"
  }];

function ReadCookie(name)
{
  name += '=';
  var parts = document.cookie.split(/;\s*/);
  for (var i = 0; i < parts.length; i++)
  {
    var part = parts[i];
    if (part.indexOf(name) == 0)
      return part.substring(name.length)
  }
  return null;
}
})();