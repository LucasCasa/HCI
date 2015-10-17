(function(){
	var navapp = angular.module('navbar', []);

	navapp.controller("NavController",function($scope,$http,$log){
	$scope.categorias = [
		{name:'Hombres',
		id:0},{name:'Mujeres',
		id:1},{name:'Niños',
		id:2},{name:'Niñas',
		id:3},{name:'Bebes',
		id:4}];	
		$scope.seleccionada = 'Todas las categorias';
        $scope.itemsOnCart = 0;
	    $http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllCategories").then(function(res){
		$scope.subcategorias = [[],[],[],[],[]];
		for(i in res.data.categories){
			if($.inArray('Adulto' , res.data.categories[i].attributes[0].values) != -1){
				if($.inArray('Masculino' , res.data.categories[i].attributes[1].values) != -1){
					$scope.subcategorias[0].push(res.data.categories[i].name);
				}
			}
			if($.inArray('Adulto' , res.data.categories[i].attributes[0].values) != -1){
				if($.inArray('Femenino' , res.data.categories[i].attributes[1].values) != -1){
					$scope.subcategorias[1].push(res.data.categories[i].name);
				}
			}
			if($.inArray('Infantil' , res.data.categories[i].attributes[0].values) != -1){
				if($.inArray('Masculino' , res.data.categories[i].attributes[1].values) != -1){
					$scope.subcategorias[2].push(res.data.categories[i].name);
				}
			}
			if($.inArray('Infantil' , res.data.categories[i].attributes[0].values) != -1){
				if($.inArray('Femenino' , res.data.categories[i].attributes[1].values) != -1){
					$scope.subcategorias[3].push(res.data.categories[i].name);
				}
			}
			if($.inArray('Bebe' , res.data.categories[i].attributes[0].values) != -1){
				$scope.subcategorias[4].push(res.data.categories[i].name);
			}
		}
	});
    $scope.numberOfItemsInCart = function(){
        if(ReadCookie("carritoOrderId") !== null){
            $log.debug("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + ReadCookie("user") + "&authentication_token=" + ReadCookie("token") + "&id=" + ReadCookie("carritoOrderId"));
            $http.get("http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + ReadCookie("user") + "&authentication_token=" + ReadCookie("token") + "&id=" + ReadCookie("carritoOrderId")).then(function(res){
                $log.debug(res);
                if(res.data.error === undefined){
                    $scope.itemsOnCart = res.data.order.items.length;
                }
            });
        }
    }
    $scope.numberOfItemsInCart();
	$scope.selectedItem = function(event) {
    	$scope.seleccionada = event;
    	var value = angular.element( document.querySelector( '#search_param' ) );
    	if(event.indexOf('-') != -1){
    	var cat = event.substring(0,event.indexOf('-') - 1);
    	var sub = event.substring(event.indexOf('-') + 2, event.length);
    	$log.debug(cat);
    	$log.debug(sub);
            var aux = encodeURI(cat + '&s=' + sub)
    		value.val(aux);
            $log.debug(decodeURI(aux));
    	} else {
    		value.val(event);
    	}	
	}
    $scope.isLoged = function(){
    	if(document.cookie.indexOf('user') == -1){
    		return false;
    	}else{
    		return true;
    	}
    }
    $scope.userName = function(){
    	if($scope.isLoged()){
    		var cookie = document.cookie;
    		return ReadCookie("user");
    	}else{
    		return "";
    	}
    }
    $scope.logout = function(){
    	document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "carritoOrderId=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "wishlistOrderID=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    	location.href='index.html';
    }
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
    }

	/* $(".dropdown-submenu").on('click', 'a', function(){
        $(this).closest(".search-panel").siblings(".cat").val($(this).text()+"&s=" + $(this).parent().text());
        $(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
        $(this).closest(".search-panel").find(".btn").val($(this).text());
    });
     $(".dropdown-menu").on('click', 'li a', function(){

        $(this).closest(".search-panel").siblings(".cat").val($(this).text());
        $(this).closest(".search-panel").child(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
        $(this).parent().parent().siblings(".btn:first-child").val($(this).text());
    });*/
});
 navapp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
  
})();

 