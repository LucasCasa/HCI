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
 
 app.controller('CarritoController',function($scope,$http,$log){
	var user = ReadCookie("user");
	var token = ReadCookie("token");
 	$scope.selected = {};
 	$scope.productos = [];
 	$scope.loading = true;
 	var orderID = ReadCookie("carritoOrderId");
 	if(orderID !== null){
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + user + "&authentication_token=" + token + "&id=" + orderID).then(function(res){
			$log.debug(res);
			$scope.productos = res.data.order.items;
			if($scope.productos.length == 0){
				$scope.emptyCart = true;
			}
			$scope.total = 0;
			$scope.productos.forEach(function(entry){
				$scope.total += entry.price;
				$scope.selected[entry.id] = entry.quantity;
			})
			$scope.loading = false;
		});
	}else{
		$scope.loading = false;
		$scope.emptyCart = true; 
	}
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
	this.remove = function(id,index){
		$scope.loading = true;
		var esto = this;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username='+ user +'&authentication_token='+ token +'&id=' + id).then(function(res){
			$log.debug(res);
			$scope.loading = false;
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

$(document).on('click', '.dropdown-menu li a', function(){
    //$(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
    $(this).closest(".btn-group").find("button").text($(this).text());
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
/*
$(document).on('click', '.btn-rmv',function(){
	var row = $(this).closest("tr");            // find parent tr
    var index = $("table").find(row).index() + 1;    // get index of tr
	$(this).closest("tr").remove();
	$(document).find(".infoblock h5:nth-child(" + index + ")").remove();
});*/