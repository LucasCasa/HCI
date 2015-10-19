(function(){
	
	var app = angular.module('aboutus',['navbar','footer']);

	app.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	}
 	
 	});
 	app.directive('customFooter',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "footer.html"
 	}
 	});




})();