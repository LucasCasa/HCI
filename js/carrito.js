(function() {
var app = angular.module('Carrito', ['navbar']);
	
 app.controller('CarritoController',function($scope,$http,$log){
	var user = ReadCookie("user");
	var token = ReadCookie("token");
 	$scope.selected = {};
 	$scope.productos = [];
 	$scope.loading = true;
 	var orderID = ReadCookie("carritoOrderId");
 	var modifiedIds = [];
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
		var ids = {product:id, order:idInOrder};
		var present = false;
		modifiedIds.forEach(function(e){
			if(e.order == idInOrder)
				present = true;
		})
		if(!present)
			modifiedIds.push(ids);
	}
	this.updateAmounts = function(){
		var esto = this;
		modifiedIds.forEach(function(ids){
			$scope.loading = true;
			esto.remove(ids.product);
			$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username=' + user + '&authentication_token=' + token + '&order_item={"order":{"id":' + orderID + '},"product":{"id": ' + ids.order + '},"quantity":'+ $scope.selected[ids.product] +'}').then(function(res){
				$log.debug("item reagregado: ");
				$log.debug(res);
				$scope.loading = false;
			});
		})
		modifiedIds = [];
	};
	this.updateTotal= function(){
		$scope.total = 0;
		if($scope.productos !== undefined){
			$scope.productos.forEach(function(entry){
				$scope.total += entry.price * $scope.selected[entry.id];
			});
		}
	};
	this.add = function(value,id,idInOrder){
		this.change(id,idInOrder);
		$scope.selected[id] = parseInt($scope.selected[id]) + value;
		if($scope.selected[id] < 1 || isNaN($scope.selected[id]))
			$scope.selected[id] = 1;
		this.updateTotal();
	};
	this.remove = function(id,index){
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
		var idIndex = modifiedIds.indexOf(id);
		if (idIndex > -1) {
    		modifiedIds.splice(idIndex, 1);
		}
	};
	$(window).unload(function(){
		this.updateAmounts();
	});
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
