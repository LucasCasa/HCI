(function(){
	
	var capp = angular.module('contacto',['navbar','footer'])

	capp.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	}
 	});
 	capp.directive('customFooter',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "footer.html"
 	}
 	});




})();
