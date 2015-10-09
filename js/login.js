(function(){
var app = angular.module('login',['navbar']);

	app.factory('UserCache', ['$cacheFactory', function($cacheFactory) {
    	return $cacheFactory('super-cache');
  	}]);
app.controller('RegisterController',function($scope,$http,$log){
	this.isRegistering = false;
	this.toggleRegistering = function(){
		this.isRegistering = !this.isRegistering;
	};
	this.getInclude = function(){
		if(this.isRegistering){
			return 'register.html';
		}else{
			return '';
		}
	}
});

app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
app.controller("LoginController",function($scope,$http,$log){
	$log.debug($scope);
	this.login = function(){
		$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + $scope.loginUser + "&password=" + $scope.loginPass).then(function(res){
			$log.debug("Estas logueado, tu token es: " + res.data.authenticationToken);
			document.cookie="token=" +res.data.authenticationToken+"; path=/";
			document.cookie="user=" + $scope.loginUser + "; path=/";
		});
	};
});

})();