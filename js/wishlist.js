(function(){ 
var app = angular.module('wishlist',['navbar']);

 app.controller('WishlistController',function($scope,$http,$log){
	var user = ReadCookie("user");
	var token = ReadCookie("token");
	var orderID = ReadCookie("wishlistOrderID");
	$scope.loading = true;
	$scope.emptyList = false;
	if(orderID !== null){
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + user + "&authentication_token=" + token + "&id=" + orderID).then(function(res){
			$scope.productos = res.data.order.items;
			$scope.loading = false;
		});
	}else{
		$scope.loading = false;
		$scope.emptyList = true; 
	}
});
 app.directive('navBar',function(){
 	return{restrict: 'E',templateUrl: "nav.html"};
 });
})();


$(document).ready(function(){
	$("tbody").on("click",".btn-rmv",function(){
		$(this).closest("tr").remove();
	});
});

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
