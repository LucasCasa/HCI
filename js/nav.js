(function(){
	var navapp = angular.module('navbar', []);

	navapp.directive('navBar',function(){
	return{
		restrict: 'E',
		templateUrl : '../nav.html'
	};
});

	navapp.controller("NavController",function($scope,$http,$log){
	$scope.categorias = [
		{name:'Hombres',
		id:0},{name:'Mujeres',
		id:1},{name:'Niños',
		id:2},{name:'Niñas',
		id:3},{name:'Bebes',
		id:4}];	
		$scope.seleccionada = 'Todo';
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
	$scope.selectedItem = function(event) {
    	$scope.seleccionada = event;
    	var value = angular.element( document.querySelector( '#search_param' ) );
    	if(event.indexOf('-') != -1){
    	var cat = event.substring(0,event.indexOf('-') - 1);
    	var sub = event.substring(event.indexOf('-') + 2, event.length);
    	$log.debug(cat);
    	$log.debug(sub);
    		value.val(cat + "&s=" + sub);
    	} else {
    		value.val(event);
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
})();

 