(function(){
var app = angular.module('productoApp',['navbar','footer']);
app.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
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
  };
 });
app.controller('ProductController',function($scope,$http,$log){
  var cookie = document.cookie;
  var user = ReadCookie("user");
  var token = ReadCookie("token");
  var esto = this;
  $scope.loading = true;
	this.prodId = parent.document.URL.substring(parent.document.URL.indexOf('?') + 4, parent.document.URL.length);
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + this.prodId).then(function(res){
    $scope.loading = false;
    $log.debug(res);
    if(res.data.error !== undefined){
      alert("Hubo un error procesando la solicitud");
    }else{
		  $scope.producto = res.data.product;
      $scope.cat = esto.getCat();  
    }
    
	});
  $scope.loadingCart = false;
  $scope.loadingWl = false;
  $scope.cartBtn = "";
  $scope.WlBtn = "";
  $scope.selectedAmount = 1;
	this.selected = 1;
	this.select = function(value){
		this.selected = value;
	};
  this.getCat = function(){
    var devuelveEdad = false;
    var edad = "";
    var genero = ""
    $scope.producto.attributes.forEach(function(attr){
      if(attr.id == 1){
        genero = attr.values[0]
        if(attr.values.length != 1)
          devuelveEdad = true;
      }else if(attr.id == 2){
        edad = attr.values[0];
      }
    })
    if(devuelveEdad){
      return edad;
    }
    if(edad == "Adulto"){
      if(genero == "Masculino"){
        return "Hombre";
      }else{
        return "Mujer";
      }
    }else if(edad == "Infantil"){
      if(genero == "Masculino"){
        return "Niños";
      }else{
        return "Niñas";
      }
    }else if(edad == "Bebe"){
      return "Bebe";
    }
    return "";
  };
  this.addToWl = function(){
    $scope.loadingWl = true;
    var esto = this;
    if(ReadCookie("wishlistOrderID")==null){
      $http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + user + "&authentication_token=" + token).then(function(res){
        $log.debug(res);
        document.cookie="wishlistOrderID=" + res.data.order.id + "; path=/";
        esto.addWlWithOrder();
      });
    }else{
      this.addWlWithOrder();
    }
  };
  this.addWlWithOrder = function(){
    var orderID = ReadCookie("wishlistOrderID");
    $http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=' + user + '&authentication_token=' + token + '&order_item={"order":{"id":' + orderID + '},"product":{"id": ' + this.prodId + '},"quantity":'+ 5 +'}').then(function(res){
      $log.debug('quantity: ' + $scope.selectedAmount);
      $log.debug('token: ' + token);
      $log.debug('orderID: ' + orderID);
      $log.debug(res);
      $scope.WlBtn = "disabled";
      $(document).find("#btn-wl").html("<span class=\"glyphicon glyphicon-ok\"></span> Agregado a la lista de Deseos");
    });
  };
  this.addToCart = function(){
    $scope.loadingCart = true;
    var esto = this;
    if(ReadCookie("carritoOrderId")==null){
      $http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + user + "&authentication_token=" + token).then(function(res){
        $log.debug(res);
        document.cookie="carritoOrderId=" + res.data.order.id + "; path=/";
        esto.addCartWithOrder();
      });
    }else{
      this.addCartWithOrder();
    }
  };
  this.addCartWithOrder = function(){
    var orderID = ReadCookie("carritoOrderId");
    $http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=' + user + '&authentication_token=' + token + '&order_item={"order":{"id":' + orderID + '},"product":{"id": ' + this.prodId + '},"quantity":'+ $scope.selectedAmount +'}').then(function(res){
      $log.debug('quantity: ' + $scope.selectedAmount);
      $log.debug('token: ' + token);
      $log.debug('orderID: ' + orderID);
      $log.debug(res);
      $scope.cartBtn = "disabled";
      $(document).find("#btn-cart").html("<span class=\"glyphicon glyphicon-ok\"></span> Agregado al carrito");
    });
  };
  this.add = function(value){
    $scope.selectedAmount = parseInt($scope.selectedAmount) + value;
    if($scope.selectedAmount < 1 || isNaN($scope.selectedAmount))
      $scope.selectedAmount = 1;
  };
  this.isLoged = function(){
    return user != null;
  };
});

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