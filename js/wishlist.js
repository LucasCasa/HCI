(function(){ 
var app = angular.module('wishlist',['navbar','footer']);

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
 app.controller('WishlistController',function($scope,$http,$log){
	var user = ReadCookie("user");
	var token = ReadCookie("token");
	var orderID = ReadCookie("wishlistOrderID");
	$scope.loading = true;
	$scope.emptyList = false;
	if(orderID !== null){
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + user + "&authentication_token=" + token + "&id=" + orderID).then(function(res){
			$log.debug(res);
			$scope.productos = res.data.order.items;
			$scope.loading = false;
		});
	}else{
		$scope.loading = false;
		$scope.emptyList = true; 
	}
	this.remove = function(id,index){
		$scope.loading = true;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username='+ user +'&authentication_token='+ token +'&id=' + id).then(function(res){
			$log.debug(res);
			$scope.loading = false;
			$scope.productos.splice(index,1);
		});
		if($scope.productos.length == 0){
			$scope.emptyList = true;
		}
	};
	this.addToCart = function(id,index){
	    $scope.loadingCart = true;
	    if(ReadCookie("carritoOrderId")==null){
	      $http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + user + "&authentication_token=" + token).then(function(res){
	        $log.debug(res);
	        document.cookie="carritoOrderId=" + res.data.order.id + "; path=/";
	        this.addCartWithOrder(id,index);
	      });
	    }else{
	      this.addCartWithOrder(id,index);
	    }
  	};
  	this.addCartWithOrder = function(id,index){
	    var orderID = ReadCookie("carritoOrderId");
	    var esto = this;
	    $http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=' + user + '&authentication_token=' + token + '&order_item={"order":{"id":' + orderID + '},"product":{"id": ' + id + '},"quantity":'+ 1 +'}').then(function(res){
	    	esto.remove(id,index);
	    });
  	};
});
})();

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
