(function() {
var app = angular.module('search', ['navbar','ui.bootstrap']);



app.controller('BusquedaController',function($scope,$http,$log,$location){

	var page=1;
	var itemsPerPage = 8;


	$scope.sacarFiltro = function(){
		console.log("Saca!");

	};
callAPI(page,itemsPerPage);
	$scope.changePage = function(pageNumb){
		$scope.loading = true;
		callAPI(pageNumb,itemsPerPage);
	}
	 $scope.loading = true;


		$scope.setPage = function (pageNo) {
	 		$scope.currentPage = pageNo;
			console.log(pageNo);
 		};


		$scope.changeItemsPerPage = function(num){
			$scope.loading=true;

			itemsPerPage = num;
			callAPI(page,itemsPerPage);
		}




function checkGender( cat){
	var filters = "&filters="
 if(cat.localeCompare("Hombres")==0){
	 console.log("Hombres");
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"}]');
 }else if (cat.localeCompare("Mujeres")==0) {
	 console.log(" Mujeres");
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"}]');
 }else if (cat.localeCompare("Niños")==0) {
	 console.log("Ninos");
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"},{"id":2,"value":"Infantil"}]');
 }else if (cat.localeCompare("Niñas")==0) {
	 console.log("Ninas");
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"},{"id":2,"value":"Infantil"}]');
 }else if (cat.localeCompare("Bebes")==0) {
	 console.log("Bebes");
	 filters += encodeURIComponent('[{"id":2,"value":"Bebe"}]');
 }
 return filters;
}

function callAPI(page , itemsPerPage){

	var checkFilters = function(filters){
		for(var filter in filters){
			console.log(filter.id);
		}
	}

	var putFilter = function(name){
		var li = document.createElement('li');
		li.className = 'filterApli';
		li.id = name;
		li.innerHTML = '<h2 class="applied-fliter" >'+ name +'<a href="" rel="nofollow"> <button onclick="sacarFiltro(\''+name+'\')" type="button" class="close" aria-label="Close"><span aria-hidden="true"/>&times;</span></button></a></h2>';
		document.getElementById('filtrados').appendChild(li);
	}
	var onSuccess = function(res){
	$log.debug(res.data.products);
	$scope.destacados = res.data.products;
	$scope.loading = false;
	$scope.totalItems = res.data.total;
	$scope.currentPage =res.data.page;
	$scope.noOfPages = ($scope.totalItems)/8;
	$scope.maxSize = 5;

	$scope.filters = res.data.filters;
	var i=0;
	for(i;i<$scope.filters.length -1 ; i++){
		console.log($scope.filters[i].id);
	}


	if((filt != "") && (filt != "all")){
		putFilter(filt);
	}
	if(categoria!= undefined){
		putFilter(categoria);

	}



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

	var param = (url.split("?")[1]);
	param = decodeURIComponent(param);
	param = param.split("&");
	console.log(param);

	var busqueda = param[0].split("=")[1];
	var filt = param[1].split("=")[1];
	if(param.length>2){
		var categoria = param[2].split("=")[1];
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
		if(page!=1){
			newURL+= "&page=" + page;
		}
		if(itemsPerPage!= 8){
			newURL+= "&page_size="+itemsPerPage;
		}
		newURL +=checkGender(filt);
	}else {
		console.log("Hay algo para buscar");
		//GetProductsByName
		newURL += byName;
		newURL += busqueda;
		if(page!=1){
			newURL+= "&page=" + page;
		}
		if(itemsPerPage!= 8){
			newURL+= "&page_size="+itemsPerPage;
		}
		if(filt.localeCompare("all")!=0){

		newURL +=checkGender(filt);
	}

	}



$http.get(newURL).then(onSuccess,onErrorOcurred);


}


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

function sacarFiltro(filtro){

	console.log(filtro);


var elem = document.getElementById(filtro);
document.getElementById('filtrados').removeChild(elem);
var categorias= ['Hombres','Mujeres','Niños','Niñas','Bebes'];
var subcategorias = ['Calzado','Indumentaria','Accesorios'];


//search.html?x=&cat=Hombres&s=Calzado
var url = window.location.href;
var urlArray = url.split("/");
var pos = urlArray.length;

url = urlArray[pos-1];
console.log(url);

var param = (url.split("?")[1]);
param = decodeURIComponent(param);
param = param.split("&");
console.log(param);

var busqueda = param[0].split("=")[1];
var filt = param[1].split("=")[1];
if(param.length>2){
	var categoria = param[2].split("=")[1];
}
var i=0;
var url = "search.html?x=&cat=";
var flag = true;
if(filt!=undefined){
for(i ; i<categorias.length ; i++){
	if(categorias[i].localeCompare(filtro)==0){
		filt = "";
	}
}

	url += filt;
}

if(categoria!=undefined){
for(i=0 ; i<subcategorias.length ; i++){
	if(subcategorias[i].localeCompare(filtro)==0){
		categoria = "";
			flag = false;
	}
}
if(flag)
	url += "&s="+categoria;
}


//if((filt==undefined) && (categoria == undefined)){
//	url = search.html?x=&cat=all
//}
if(((filt == "") && (categoria == undefined)) || ((filt == "") && (categoria == ""))){
	console.log("P{rimera}");
	url = "search.html?x=&cat=all";
}

window.location.href= url;
//window.location.href = "www.mysite.com/page2.php";
}
