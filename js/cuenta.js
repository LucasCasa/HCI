(function() {
var app = angular.module('Cuenta', []);
 app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	};

 });
 app.controller("CuentaController",function(){

 });
})();