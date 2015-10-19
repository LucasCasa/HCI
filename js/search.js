(function() {
var app = angular.module('search', ['navbar','ui.bootstrap','footer']);

app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
app.directive('customFooter',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "footer.html"
 	};

 });
app.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});

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
function urlParser(){
	var result = ["","","","","",""];
	var url = window.location.href;
	var urlArray = url.split("/");
	var pos = urlArray.length;

	url = urlArray[pos-1];

	var param = (url.split("?")[1]);
	param = decodeURIComponent(param);
	param = param.split("&");
	for(var i=0 ; i<param.length;i++){
		var inside = param[i].split("=");
		if(inside[0]=="x"){
			result[0] = inside[1];
		}
		if(inside[0]=="cat"){
			result[1] = inside[1];
		}
		if(inside[0]=="s"){
			result[2] = inside[1];
		}
		if(inside[0]=="ss"){
			result[3] = inside[1];
		}
		if(inside[0]=="f"){
			result[4] = inside[1];
		}
		if(inside[0]=="c"){
			result[5]= inside[1];
		}
	}
	return result;
	//console.log(param);
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
		return encodeURIComponent(url);
}

function formURL( parametros){
	var byCategory = "GetProductsByCategoryId&id=";
  var allCategories = "GetAllProducts";
  var byName = "GetProductsByName&name=";
	var busqueda =parametros[0];
	var filt = parametros[1];
	var categoria = parametros[2];
	var ss = parametros[3];
	var filtro = parametros[4];
	var color = parametros[5];
  var newURL = "";

	if(busqueda == ""){
		//console.log("no hay busqueda");
		//SearchByCategory
		if(categoria == ""){
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
	//	newURL +=checkGender(filt,hayFiltro,filtro);

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

		newURL +=GetAllProducts;
	}


	}
	if(page!=1){
		newURL+= "&page=" + page;
	}
	if(itemsPerPage!= 8){
		newURL+= "&page_size="+itemsPerPage;
	}









	var filters = "&filters="


	var flag = false;
 if(filt.localeCompare("Hombres")==0){
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"},{"id":2 ,"value":"Adulto"}');
 }else if (filt.localeCompare("Mujeres")==0) {
	 console.log(" Mujeres");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"},{"id":2 ,"value":"Adulto"}');
 }else if (filt.localeCompare("Niños")==0) {
	 console.log("Ninos");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Masculino"},{"id":2,"value":"Infantil"}');
 }else if (filt.localeCompare("Niñas")==0) {
	 console.log("Ninas");
	 flag=true;
	 filters += encodeURIComponent('[{"id":1,"value":"Femenino"},{"id":2,"value":"Infantil"}');
 }else if (filt.localeCompare("Bebes")==0) {
	 console.log("Bebes");
	 flag=true;
	 filters += encodeURIComponent('[{"id":2,"value":"Bebe"}');
 }

if(filtro != ""){
	filters += ","+selectFilter(filtro);
}

if(color!= ""){
	filters+= ","+selectFilter(color);
}

filters += ']';

 if(flag){
 return newURL + filters;}
 else{
	 return newURL;
 }
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

			var dd = document.createElement('dd');
			var url = window.location.href;

			var urlArray = url.split("/");
			var pos = urlArray.length;
			url = urlArray[pos-1];
			url2 = url;
			console.log(url);

			var param = (url.split("?")[1]);
			var param = param.split("&");
			var busqueda = param[0].split("=")[1];
			var filt = param[1].split("=")[1];

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
			url2+= "&c="+$scope.colores[i];
			dd.innerHTML = '<h5> <a href="'+url2 +'">' +$scope.colores[i] + '</a> </h5>'
			document.getElementById('colores').appendChild(dd);
		}


	}
	var parametros = urlParser();
	var busqueda =parametros[0];
	var filt = parametros[1];
	var categoria = parametros[2];
	var ss = parametros[3];
	var filtro = parametros[4];
	var color = parametros[5];

	var num = 1;
	if((filt != "") && (filt != "all")){
		putFilter(filt);
	}else if(filt == "all"){
		var categorias = ['Hombres','Mujeres','Niños','Niñas','Bebes'];
		var div = document.createElement('div');
		div.className = 'linea';
		div.innerHTML = '<dl> <dt id="categorias" class="titulo">Categorias</dt> </dl>';

		document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[num++]);

		for(i=0;i<categorias.length;i++){
			var dd= document.createElement('dd');

			dd.innerHTML = '<h5> <a href="'+"search.html?x=&cat="+categorias[i]+'">' + categorias[i] + '</a> </h5>';
			document.getElementById('categorias').appendChild(dd);
		}
	}
	if(categoria!= ""){
		putFilter(categoria);

	}else{
		var subcategorias = ['Calzado', 'Indumentaria' , 'Accesorios'];
		var div = document.createElement('div');
		div.className = 'linea';
		div.innerHTML = '<dl> <dt id="subcategorias" class="titulo">Subcategorias</dt> </dl>';
		document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[num]);

		for(i=0;i<subcategorias.length;i++){
			var dd= document.createElement('dd');

			dd.innerHTML = '<h5> <a href="'+"search.html?x=&cat="+filt +'&s='+subcategorias[i]+'">' + subcategorias[i] + '</a> </h5>';
			document.getElementById('subcategorias').appendChild(dd);
		}
	}
	if(filtro!=""){
		putFilter(filtro);
	}
	if(color!=""){
		putFilter(color);
	}



	}

	var onErrorOcurred= function(res){
		$scope.error = "Error";
		console.log("Error");
	}

	var parametros = urlParser();
	var busqueda =parametros[0];
	var filt = parametros[1];
	var categoria = parametros[2];
	var ss = parametros[3];
	var filtro = parametros[4];
	var color = parametros[5];

 var newURL = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=";


newURL += formURL(parametros);

$http.get(newURL).then(onSuccess,onErrorOcurred);


}




})

})();


function urlParser(){
	var result = ["","","","","",""];
	var url = window.location.href;
	var urlArray = url.split("/");
	var pos = urlArray.length;

	url = urlArray[pos-1];

	var param = (url.split("?")[1]);
	param = decodeURIComponent(param);
	param = param.split("&");
	for(var i=0 ; i<param.length;i++){
		var inside = param[i].split("=");
		if(inside[0]=="x"){
			result[0] = inside[1];
		}
		if(inside[0]=="cat"){
			result[1] = inside[1];
		}
		if(inside[0]=="s"){
			result[2] = inside[1];
		}
		if(inside[0]=="ss"){
			result[3] = inside[1];
		}
		if(inside[0]=="f"){
			result[4] = inside[1];
		}
		if(inside[0]=="c"){
			result[5]= inside[1];
		}
	}
	return result;
	//console.log(param);
}

function sacarFiltro(filtro){

	console.log(filtro);


var elem = document.getElementById(filtro);
document.getElementById('filtrados').removeChild(elem);
var categorias= ['Hombres','Mujeres','Niños','Niñas','Bebes'];
var subcategorias = ['Calzado','Indumentaria','Accesorios'];

var parametros = urlParser();
for(var i=0;i<parametros.length ;i++){
	if(filtro.localeCompare(parametros[i])==0){
		parametros[i] = "";
	}
}

//search.html?x=&cat=Hombres&s=Calzado


var busqueda =parametros[0];
var filt = parametros[1];
var categoria = parametros[2];
var ss = parametros[3];
var filtro = parametros[4];
var color = parametros[5];


var url = "search.html?";
url += "x=" + busqueda;

if(filt == ""){
	url+= "&cat=all";
}else{
	url+="&cat="+filt;
}
if(categoria!=""){
	url+= "&s="+categoria;
}
if(filtro!=""){
	url+="&f="+filtro;
}
if(color!=""){
	url+= "&c=" + color;
}

window.location.href= url;

}
