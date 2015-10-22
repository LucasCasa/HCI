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
	var subCalzados = ['Alpargatas','Balerinas','Borcegos','Botas','Mocasines','Ojotas','Pantuflas','Sandalias','Zapatillas','Zapatos','Zuecos'];
	var subIndumentarias = ['Blazers','Buzos','Calzas','Campera','Camisas','Cardigans','Chalecos','Jeans','Pantalones','Pilotos','Polleras','Remeras','Sacos','Sweaters','Vestidos'];
	var subAccesorios = ['Anteojos','Aros','Billeteras','Carteras','Cinturones','Collares','Gorras','Llaveros','Mochilas','Pulseras','Relojes'];

	callAPI();

	$scope.changePage = function(pageNumb){
		$scope.loading = true;
		page=pageNumb;
		callAPI();
	}

	$scope.loading = true;

	$scope.setPage = function (pageNo) {
	 		$scope.currentPage = pageNo;
 	};


	$scope.changeItemsPerPage = function(num){
			$scope.loading=true;

			itemsPerPage = num;
			callAPI();
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

	}

	function selectFilter(filt){
		var colores = ['Natural', 'Gris', 'Negro', 'Rojo', 'Celeste', 'Marron' , 'Verde','Carey','Dorado' ,'Fucsia', 'Azul', 'Blanco',
    	'Plata', 'Suela', 'Rosa' ,'Bordo' ,'Multicolor' ,'Oro', 'Coral', 'Beige', 'Chocolate', 'Violeta', 'Naranja' ];

		var id =-1;

		for(var i=0;i<colores.length;i++){
			if(filt.localeCompare(colores[i])==0){
				id=4;
				break;
			}
		}
		if(id==-1){
			id =9;
		}
		var url = '{"id":'+id+',"value":"'+filt+'"}';
		return encodeURIComponent(url);
	}

	var putFilter = function(name){

		if(document.getElementById(name)== null){
			var li = document.createElement('li');
			li.className = 'filterApli';
			li.id = name;
			li.innerHTML = '<h2 class="applied-fliter" >'+ name +'<a href="" rel="nofollow"> <button onclick="sacarFiltro(\''+name+'\')" type="button" class="close" aria-label="Close"><span aria-hidden="true"/>&times;</span></button></a></h2>';
			document.getElementById('filtrados').appendChild(li);
		}
	}

	function giveSubCategory(ss){

			for(var i=0;i<subCalzados.length;i++){
				if(subCalzados[i] == ss){
					return i+1;
				}
			}
			for(var i=0;i<subIndumentarias.length;i++){
				if(subIndumentarias[i]== ss){
					return i+12;
				}
			}
			for(var i=0;i<subAccesorios.length;i++){
				if(subAccesorios[i]==ss){
					return i+27;
				}
			}


	}

	function formURL(){
		var byCategory = "GetProductsByCategoryId&id=";
  	var allCategories = "GetAllProducts";
  	var byName = "GetProductsByName&name=";
		var bySubCategory = "GetProductsBySubcategoryId&id="
		var parametros = urlParser();
		var busqueda =parametros[0];
		var filt = parametros[1];
		var categoria = parametros[2];
		var ss = parametros[3];
		var filtro = parametros[4];
		var color = parametros[5];
  	var newURL = "";


		if(busqueda == ""){
		//SearchByCategory
			if(categoria == ""){
				newURL += allCategories;
			}else if(ss == ""){
				newURL += byCategory;
				if(categoria.localeCompare("Calzado")==0){
					newURL += "1";
				}else if (categoria.localeCompare("Indumentaria")==0) {
					newURL += "2";
				}else if (categoria.localeCompare("Accesorios")==0) {
					newURL += "3";
				}
			}else{
				newURL += bySubCategory;
				newURL += giveSubCategory(ss);
			}
	//	newURL +=checkGender(filt,hayFiltro,filtro);

		}else{
		//GetProductsByName
			newURL += byName;
			newURL += busqueda;

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


	var filters = "&filters=["


	var flag = false;
 if(filt.localeCompare("Hombres")==0){
	 flag=true;
	 filters += encodeURIComponent('{"id":1,"value":"Masculino"},{"id":2 ,"value":"Adulto"}');
 }else if (filt.localeCompare("Mujeres")==0) {
	 flag=true;
	 filters += encodeURIComponent('{"id":1,"value":"Femenino"},{"id":2 ,"value":"Adulto"}');
 }else if (filt.localeCompare("Niños")==0) {
	 flag=true;
	 filters += encodeURIComponent('{"id":1,"value":"Masculino"},{"id":2,"value":"Infantil"}');
 }else if (filt.localeCompare("Niñas")==0) {
	 flag=true;
	 filters += encodeURIComponent('{"id":1,"value":"Femenino"},{"id":2,"value":"Infantil"}');
 }else if (filt.localeCompare("Bebes")==0) {
	 flag=true;
	 filters += encodeURIComponent('{"id":2,"value":"Bebe"}');
 }

if(filtro != ""){
	if(flag){
		filters +=",";
	}
	filters +=selectFilter(filtro);
	flag =true;
}

if(color!= ""){
	if(flag){
		filters+=",";
	}
	filters+=selectFilter(color);
	flag=true;
}

filters += ']';

 if(flag){
 return newURL + filters;}
 else{
	 return newURL;
 }
}

function getBrowserURL(){
	var url = window.location.href;
	var url = url.split("/");
	var pos = url.length;
	url = url[pos-1];

	return url;
}


function putBrandFilters(){
	var parametros = urlParser();
	var marca = parametros[4];
	if(marca == ""){
		if(document.getElementById("marca") == null){
			var div = document.createElement('div');
			div.className = 'linea';
			div.innerHTML = '<dl> <dt id="marca" class="titulo">Marca</dt> </dl>';
			document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[1]);
				var url = getBrowserURL();
				for(var i=0;i<$scope.filtroMarca.length;i++){
					var url = getBrowserURL();
					var dd = document.createElement('dd');
					url += "&f="+$scope.filtroMarca[i];
					dd.innerHTML = '<dd> <h5> <a href="'+ url +'">' +$scope.filtroMarca[i] + '</a> </h5></dd>'
					document.getElementById('marca').appendChild(dd);
				}
			}
}
}

function putColorFilters(){
	var parametros = urlParser();
	var color = parametros[5];
	if(color == ""){
		if(document.getElementById("colores") == null){
			var div = document.createElement('div');
			div.className = 'linea';
			div.innerHTML = '<dl> <dt id="colores" class="titulo">Colores</dt> </dl>';
			document.getElementById('leftSide').appendChild(div,document.getElementById('leftSide'));
			var url = getBrowserURL();
			for(i=0;i<$scope.colores.length;i++){
				var url = getBrowserURL();
				var dd = document.createElement('dd');
				url+= "&c="+$scope.colores[i];
				dd.innerHTML = '<h5> <a href="'+url +'">' +$scope.colores[i] + '</a> </h5>'
				document.getElementById('colores').appendChild(dd);
			}
		}
	}
}
function putSubSubCategoria(){
	var parametros = urlParser();
	var categoria = parametros[2];
	var ss = parametros[3];

	if(document.getElementById("subsubcategorias")==null){
		if(ss!=""){
			putFilter(ss);
		}else{
			var div = document.createElement('div');
			div.className = 'linea';
			div.innerHTML = '<dl> <dt id="subsubcategorias" class="titulo">Sub-Subcategorias</dt> </dl>';
			document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[1]);
			var array;
			if(categoria == "Calzado"){
				array = subCalzados;
			}else if(categoria == "Indumentaria"){
				array = subIndumentarias;
			}else if(categoria == "Accesorios"){
				array = subAccesorios;
			}
			var url = getBrowserURL();
			for(i=0;i<array.length;i++){
				var dd= document.createElement('dd');
				dd.innerHTML = '<h5> <a href="'+ url +'&ss=' + array[i]+ '">' + array[i] + '</a> </h5>';
				document.getElementById('subsubcategorias').appendChild(dd);
			}

		}
	}
}
function putSubCategoria(num){
	var parametros = urlParser();
	var categoria = parametros[2];
	var filt = parametros[1];

	if(document.getElementById("subcategorias") == null){
		if(categoria!= ""){
			putFilter(categoria);
			putSubSubCategoria();
		}else{
			var subcategorias = ['Calzado', 'Indumentaria' , 'Accesorios'];
			var div = document.createElement('div');
			div.className = 'linea';
			div.innerHTML = '<dl> <dt id="subcategorias" class="titulo">Subcategorias</dt> </dl>';
			document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[num]);

			for(i=0;i<subcategorias.length;i++){
				var dd= document.createElement('dd');
				var url = getBrowserURL();
				dd.innerHTML = '<h5> <a href="'+ url +'&s='+subcategorias[i]+'">' + subcategorias[i] + '</a> </h5>';
				document.getElementById('subcategorias').appendChild(dd);
			}
		}
	}
}

function putMainFilter(){
	var parametros = urlParser();
	var filt = parametros[1];
	var num =1;

	if(document.getElementById("categorias") == null ){
		if((filt != "") && (filt != "all")){
			putFilter(filt);
			putSubCategoria(num);
		}else if(filt == "all"){
			var categorias = ['Hombres','Mujeres','Niños','Niñas','Bebes'];
			var div = document.createElement('div');
			div.className = 'linea';
			div.innerHTML = '<dl> <dt id="categorias" class="titulo">Categorias</dt> </dl>';

			document.getElementById('leftSide').insertBefore(div,document.getElementById('leftSide').children[num++]);

			for(i=0;i<categorias.length;i++){
				var dd= document.createElement('dd');
				var url = getBrowserURL();
				dd.innerHTML = '<h5> <a href="'+ url +'&cat='+categorias[i]+'">' + categorias[i] + '</a> </h5>';
				document.getElementById('categorias').appendChild(dd);
			}
		}
	}
}



function callAPI(){
	var onSuccess = function(res){
		$log.debug(res.data.products);
		$scope.destacados = res.data.products;
		$scope.loading = false;
		$scope.totalItems = res.data.total;
		$scope.currentPage =res.data.page;
		$scope.noOfPages = ($scope.totalItems)/8;
		$scope.maxSize = 5;
		$scope.filters = res.data.filters;

		//Separar las asignaciones una vez que vienen de la API
		//Lo que esta abajo de alguna manera sacarlo afuera

		//Asigna a las variables los arrays de las marcas y los colores porque vienen otros filtros tambien
		if($scope.filters != undefined){
			for(var i=0;i<$scope.filters.length -1 ; i++){
				if($scope.filters[i].id == 9){
					console.log($scope.filters[i]);
					$scope.filtroMarca = $scope.filters[i].values;
				}
				if($scope.filters[i].id == 4){
					$scope.colores = $scope.filters[i].values;
				}
			}
			//Pone los filtros a la izquierda
			putBrandFilters();
			//pone Filtros de colores
			putColorFilters();
		}

	putMainFilter();



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
if(ss!=""){
	url+="&ss=" + ss;
}
if(filtro!=""){
	url+="&f="+filtro;
}
if(color!=""){
	url+= "&c=" + color;
}

window.location.href= url;

}
