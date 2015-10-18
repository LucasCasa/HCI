(function() {
var app = angular.module('Carrito', ['navbar']);
	
 app.controller('CarritoController',function($scope,$http,$log){
	var user = ReadCookie("user");
	var token = ReadCookie("token");
 	$scope.selected = {};
 	$scope.productos = [];
 	$scope.loading = true;
 	var orderID = ReadCookie("carritoOrderId");
 	if(orderID !== null){
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + user + "&authentication_token=" + token + "&id=" + orderID).then(function(res){
			$scope.productos = res.data.order.items;
			if($scope.productos.length == 0){
				$scope.emptyCart = true;
			}
			$scope.total = 0;
			$scope.productos.forEach(function(entry){
				$scope.total += entry.price * entry.quantity;
				$scope.selected[entry.id] = entry.quantity;
			})
			$scope.loading = false;
		});
	}else{
		$scope.loading = false;
		$scope.emptyCart = true; 
	}
	this.change = function(id,idInOrder){
		this.updateTotal();
		this.removeProduct(id);
		$scope.loading = true;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=' + user + '&authentication_token=' + token + '&order_item={"order":{"id":' + orderID + '},"product":{"id": ' + idInOrder + '},"quantity":'+ $scope.selected[id] +'}').then(function(res){
			$scope.loading = false;
		});
	};
	this.updateTotal= function(){
		$scope.total = 0;
		if($scope.productos !== undefined){
			$scope.productos.forEach(function(entry){
				$scope.total += entry.price * $scope.selected[entry.id];
			});
		}
	};
	this.write = function(id,idInOrder){
		var Tout;
		clearTimeout(Tout);
		Tout = setTimeout(function(esto) {
	    	esto.change(id,idInOrder);
		}, 1800,this);
	};
	this.add = function(value,id,idInOrder){
		$scope.selected[id] = parseInt($scope.selected[id]) + value;
		if($scope.selected[id] < 1 || isNaN($scope.selected[id]))
			$scope.selected[id] = 1;
		this.updateTotal();
		this.change(id,idInOrder);
	};
	this.removeProduct = function(id,index){
		$scope.loading = true;
		var esto = this;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username='+ user +'&authentication_token='+ token +'&id=' + id).then(function(res){
			$scope.loading = false;
			$log.debug(res);
			if(!(index === undefined))
				$scope.productos.splice(index,1);
			esto.updateTotal();
		});
		if($scope.productos.length == 0){
			$scope.emptyCart = true;
		}
	};
	$scope.isLoged = function(){
        if(document.cookie.indexOf('user') == -1){
            return false;
        }else{
            return true;
        }
    }
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
