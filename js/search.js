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


function selectFilter(filt){
	var colores = ['Natural', 'Gris', 'Negro', 'Rojo', 'Celeste', 'Marron' , 'Verde','Carey','Dorado' ,'Fucsia', 'Azul', 'Blanco',
    'Plata', 'Suela', 'Rosa' ,'Bordo' ,'Multicolor' ,'Oro', 'Coral', 'Beige', 'Chocolate', 'Violeta', 'Naranja' ];
		var i =0;
		var id =-1;
		//"id": 4,
//"name": "Color"
//},
//{
//"id": 9,
//"name": "Marca"
		for(i;i<colores.length;i++){
			if(filt.localeCompare(colores[i])==0){
				id=4;
				break;
			}
		}
		if(id=-1){
			id =9;
		}
		var url = '{"id":'+id+',"value":"'+filt+'"}';
		return url;
}

function checkGender( cat, isFiltered , filter){
	var filters = "&filters="
	var flag = false;
 if(cat.localeCompare("Hombres")==0){
	 console.log("Hombres");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"},{"id":2 ,"value":"Adulto"}');
 }else if (cat.localeCompare("Mujeres")==0) {
	 console.log(" Mujeres");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"},{"id":2 ,"value":"Adulto"}');
 }else if (cat.localeCompare("Niños")==0) {
	 console.log("Ninos");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"},{"id":2,"value":"Infantil"}');
 }else if (cat.localeCompare("Niñas")==0) {
	 console.log("Ninas");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"},{"id":2,"value":"Infantil"}');
 }else if (cat.localeCompare("Bebes")==0) {
	 console.log("Bebes");
	 flag=true;
	 filters += encodeURIComponent('[{"id":2,"value":"Bebe"}');
 }

 if(isFiltered){
	 filters += ","+selectFilter(filter) + "]";
 }else if(flag){
	 filters += "]";
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
		console.log(document.getElementById('name'));
		if(document.getElementById('name')== null){
		var li = document.createElement('li');
		li.className = 'filterApli';
		li.id = name;
		li.innerHTML = '<h2 class="applied-fliter" >'+ name +'<a href="" rel="nofollow"> <button onclick="sacarFiltro(\''+name+'\')" type="button" class="close" aria-label="Close"><span aria-hidden="true"/>&times;</span></button></a></h2>';
		document.getElementById('filtrados').appendChild(li);
	}
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
	if($scope.filters !== undefined){
		for(i;i<$scope.filters.length -1 ; i++){
			console.log($scope.filters[i].id);
			if($scope.filters[i].id == 9){
				console.log($scope.filters[i]);
				$scope.filtrosaPoner = $scope.filters[i].values;
			}
			if($scope.filters[i].id == 4){
				$scope.colores = $scope.filters[i].values;
			}
		}

		for(i=0;i<$scope.filtrosaPoner.length;i++){
			console.log($scope.filtrosaPoner[i]);
			var dd = document.createElement('dd');
			var url = window.location.href;
			console.log(url);
			var urlArray = url.split("/");
			var pos = urlArray.length;
			url = urlArray[pos-1];
			console.log(url);

			var param = (url.split("?")[1]);
			var param = param.split("&");
			var busqueda = param[0].split("=")[1];
			var filt = param[1].split("=")[1];
			//file:///Users/dero/Sites/search.html?x=&cat=all&f=
			//file:///Users/dero/Sites/search.html?x=&cat=Hombres&f=
			//file:///Users/dero/Sites/search.html?x=&cat=Hombres&s=Calzado&f=
			var categoria;
			var filtro;
			var hayFiltro = false;
			if(param.length==3){
				var ver = param[2].split("=")[0];
				if(ver.localeCompare("s")==0){
					categoria = param[2].split("=")[1];
			}else{
				filtro = decodeURIComponent(param[2].split("=")[1]);
				hayFiltro = true;
			}
			}

			if(param.length==4){
				categoria = param[2].split("=")[1];
				filtro = decodeURIComponent(param[3].split("=")[1]);
				hayFiltro = true;
			}


			url += "&f="+$scope.filtrosaPoner[i];

			console.log(param);
			dd.innerHTML = '<dd> <h5> <a href="'+ url +'">' +$scope.filtrosaPoner[i] + '</a> </h5></dd>'
			document.getElementById('marca').appendChild(dd);
		}

		for(i=0;i<$scope.colores.length;i++){
			var dd = document.createElement('dd');
			dd.innerHTML = '<h5> <a href="">' +$scope.colores[i] + '</a> </h5>'
			document.getElementById('colores').appendChild(dd);
		}


	}

	if((filt != "") && (filt != "all")){
		putFilter(filt);
	}else if(filt == "all"){
		var categorias = ['Hombres','Mujeres','Niños','Niñas','Bebes'];
		var div = document.createElement('div');
		div.className = 'linea';
		div.innerHTML = '<dl> <dt id="categorias" class="titulo">Categorias</dt> </dl>';

		document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[1]);

		for(i=0;i<categorias.length;i++){
			var dd= document.createElement('dd');

			dd.innerHTML = '<h5> <a href="'+"search.html?x=&cat="+categorias[i]+'">' + categorias[i] + '</a> </h5>';
			document.getElementById('categorias').appendChild(dd);
		}
	}
	if(categoria!= undefined){
		putFilter(categoria);

	}
	if(hayFiltro){
		putFilter(filtro);
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
	//file:///Users/dero/Sites/search.html?x=&cat=all&f=
	//file:///Users/dero/Sites/search.html?x=&cat=Hombres&f=
	//file:///Users/dero/Sites/search.html?x=&cat=Hombres&s=Calzado&f=
	var categoria;
	var filtro;
	var hayFiltro = false;
	if(param.length==3){
		var ver = param[2].split("=")[0];
		if(ver.localeCompare("s")==0){
			categoria = param[2].split("=")[1];
	}else{
		filtro = decodeURIComponent(param[2].split("=")[1]);
		hayFiltro = true;
	}
	}

	if(param.length==4){
		categoria = param[2].split("=")[1];
		filtro = decodeURIComponent(param[3].split("=")[1]);
		hayFiltro = true;
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
		newURL +=checkGender(filt,hayFiltro,filtro);
	}else {
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

		newURL +=checkGender(filt,hayFiltro,filtro);
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
//file:///Users/dero/Sites/search.html?x=&cat=all&f=
//file:///Users/dero/Sites/search.html?x=&cat=Hombres&f=
//file:///Users/dero/Sites/search.html?x=&cat=Hombres&s=Calzado&f=
var categoria;
var filtro;
var hayFiltro = false;
if(param.length==3){
	var ver = param[2].split("=")[0];
	if(ver.localeCompare("s")==0){
		categoria = param[2].split("=")[1];
}else{
	filtro = decodeURIComponent(param[2].split("=")[1]);
	hayFiltro = true;
}
}

if(param.length==4){
	categoria = param[2].split("=")[1];
	filtro = decodeURIComponent(param[3].split("=")[1]);
	hayFiltro = true;
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

if(hayFiltro){

}

//if((filt==undefined) && (categoria == undefined)){
//	url = search.html?x=&cat=all
//}
if(((filt == "") && (categoria == undefined)) || ((filt == "") && (categoria == ""))){
	url = "search.html?x=&cat=all";
}

window.location.href= url;
//window.location.href = "www.mysite.com/page2.php";
}
