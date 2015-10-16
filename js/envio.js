(function(){
	var envioApp = angular.module('Envio',[]);
	

	envioApp.controller('EnvioController',function($http,$log,$scope){
		this.texto = '{"states": [ { "stateId": "C", "name": "Ciudad Autonoma de Buenos Aires" }, { "stateId": "B", "name": "Buenos Aires" }, { "stateId": "K", "name": "Catamarca" }, { "stateId": "H", "name": "Chaco" }, { "stateId": "U", "name": "Chubut" }, { "stateId": "X", "name": "Cordoba" }, { "stateId": "W", "name": "Corrientes" },{ "stateId": "E", "name": "Entre Rios" },{ "stateId": "P", "name": "Formosa" },{ "stateId": "Y", "name": "Jujuy" },{ "stateId": "L", "name": "La Pampa" },{ "stateId": "F", "name": "La Rioja" },{ "stateId": "M", "name": "Mendoza" },{ "stateId": "N", "name": "Misiones" },{ "stateId": "Q", "name": "Neuquen" },{ "stateId": "R", "name": "Rio Negro" },{ "stateId": "A", "name": "Salta" },{ "stateId": "J", "name": "San Juan" },{ "stateId": "D", "name": "San Luis" },{ "stateId": "Z", "name": "Santa Cruz" },{ "stateId": "S", "name": "Santa Fe" },{ "stateId": "G", "name": "Santiago del Estero" },{ "stateId": "V", "name": "Tierra del Fuego" },{ "stateId": "T", "name": "Tucuman" }]}';	
		this.states = JSON.parse(this.texto).states;
		var focus = this;
		$http.get('http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username='+ readCookie("user") +'&authentication_token='+ readCookie("token")+'&page_size=9999').then(function(res){
			if(res.data.error === undefined){
				$scope.direcciones = res.data.addresses;
			}
		});

		$scope.getProvinceById = function(id){
 			for(i=0;i<focus.states.length;i++){
	 			if(focus.states[i].stateId == id){
 					return focus.states[i].name;
 				}
 			}
 		};
		
		$scope.confirmAddresses = function(){
			order = '{"id": '+ readCookie("carritoOrderId") +',"address":{ "id":'+ $scope.selectedAddress +'}}';
			$log.debug('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ChangeOrderAddress&username='+ readCookie("user") +'&authentication_token='+ readCookie("token") + '&order=' + order);
			$http.get('http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ChangeOrderAddress&username='+ readCookie("user") +'&authentication_token='+ readCookie("token") + '&order=' + order).then(function(res){
			$log.debug(res);
			});
		}
	});




function readCookie(name) {
    return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
}

})();

