(function() {
var app = angular.module('search', ['navbar']);



app.controller('BusquedaController',function($scope,$http,$log,$location){

	//$locationProvider.html5Mode(true);


	 $scope.loading = true;
		var onSuccess = function(res){
		$scope.destacados = res.data.products;
		$scope.loading = false;

		}

	var onErrorOcurred= function(res){
		$scope.error = "Error";
		console.log("Error");
	}
	var url = window.location.href;
	console.log(url);
	var urlArray = url.split("/");
	var pos = urlArray.length;

	url = urlArray[pos-1];
	console.log(url);

	var param = (url.split("?")[1]).split("&");
	console.log(param);

	var busqueda = param[0].split("=")[1];
	var filt = param[1].split("=")[1];
	if(param.length>2){
		var categoria = param[2].split("=")[1];
	}
	console.log(busqueda);
	console.log(filt);
	console.log(categoria);

function checkGender( cat){
	var filters = "&filters="
 if(cat.localeCompare("Hombres")==0){
	 console.log("Hombres");
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"}]');
 }else if (cat.localeCompare("Mujeres")==0) {
	 console.log(" Mujeres");
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"}]');
 }else if (cat.localeCompare("Ninos")==0) {
	 console.log("Ninos");
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"},{"id":2,"value":"Infantil"}]');
 }else if (cat.localeCompare("Ninas")==0) {
	 console.log("Ninas");
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"},{"id":2,"value":"Infantil"}]');
 }else if (cat.localeCompare("Bebes")==0) {
	 console.log("Bebes");
	 filters += encodeURIComponent('[{"id":2,"value":"Bebe"}]');
 }
 return filters;
}


 var newURL = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=";
 var byCategory = "GetProductsByCategoryId&id=";
 var allCategories = "GetAllProducts";
 var byName = "GetProductsByName&name=";

	if(busqueda == ""){
		//console.log("no hay busqueda");
		//SearchByCategory
		if(categoria == undefined){
			newURL += allCategories;
		}else{
			newURL += byCategory;
			if(categoria.localeCompare("Calzado")==0){
				newURL += "1";
			}else if (categoria.localeCompare("Indumentaria")==0) {
				newURL += "2";
			}else if (categoria.localeCompare("Accesorios")==0) {
				newURL += "3";
			}
		}
		newURL +=checkGender(filt);
	}else {
		console.log("Hay algo para buscar");
		//GetProductsByName
		newURL += byName;
		newURL += busqueda;
		if(filt.localeCompare("all")!=0){
		newURL +=checkGender(filt);
	}

	}



$http.get(newURL).then(onSuccess,onErrorOcurred);





 //var baseUrl  = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=1";
 //var filter = '[{"id":1,"value":"Masculino"}]';

//  console.log(encodeURIComponent(filter));
//	console.log(filter);
 //console.log(decodeURIComponent('%5B%7B"id"%3A2%2C"value"%3A"Adulto"%7D%2C%7B"id"%3A1%2C"value"%3A"Femenino"%7D%5D'));
 //baseUrl += "&filters=" + encodeURIComponent(filter);
//console.log(baseUrl);
//var newURL = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&filters=%5B%7B%22id%22%3A1%2C%22value%22%3A%22Masculino%22%7D%5D"
	//$http.get(newURL).then(onSuccess,onErrorOcurred);
//	$http.get(baseUrl).then(onSuccess,onErrorOcurred);
//	$http.get("http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByName&name="+nombre).then(onSuccess,onErrorOcurred);


})

})();
