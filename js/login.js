(function(){
var app = angular.module('login',[]);

app.controller('RegisterController',function($scope,$http,$log){


});
app.controller("LoginController",function($scope,$http,$log){


$scope.login = function(){
	$http.get("http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + $scope.loginUser + "&password=" + $scope.loginPass).then(function(res){
		$log.debug("Estas logueado, tu token es: " + res.data.authenticationToken);
		$log.debug(res);
	});
};

})
})();