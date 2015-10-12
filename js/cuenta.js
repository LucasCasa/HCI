(function() {
var app = angular.module('Cuenta', ['navbar']);
 app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
  app.directive('addAddress',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "add-address.html"
 	};

 });
 app.controller("CuentaController",function($http,$log,$scope){
 	var cookie = document.cookie;
 	var user = cookie.substring(cookie.indexOf('user=')+5,cookie.length);
 	var token = cookie.substring(cookie.indexOf('token=') + 6, cookie.indexOf('user=')-2);
 	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username="+user +"&authentication_token="+token).then(function(res){
 		$scope.user = res.data.account;
 		$log.debug(user);
 		$log.debug(token);
 		$log.debug(res.data);
 	});
 	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username="+ user +"&authentication_token="+token).then(function(res){
 		$scope.direcciones = res.data.addresses; // Fijarse que solo devuelve 8, ya que esta pensado para que haya muchas paginas de direcciones
 		$log.debug($scope.direcciones);
 	});
 	$scope.isAddress= function(){
 		return ($scope.direcciones == undefined || $scope.direcciones.length == 0);
 	}
 	$scope.saveAddress = function(){
 		var name = 'name:' + $scope.IdName;
 		var address ='{ "name":"'+ $scope.IdName+ '","street":"' +$scope.address+'","number":"'+ $scope.number+'","floor":"' +$scope.floor+'","gate":"' + $scope.dpto+'","province": "C" ,"zipCode":"'+ $scope.postalCode+'","phoneNumber":"'+ $scope.telephone+'"}';
 		$log.debug("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ address);
 		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username="+user+"&authentication_token="+token+"&address="+ address).then(function(res){
 			$log.debug(res);

 		});
 	}
 });
 app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

})();