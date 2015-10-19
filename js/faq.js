(function(){
	
	var faqapp = angular.module('faq',['navbar','footer']);

	faqapp.directive('navBar',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "nav.html"
 	}
 	
 	});
 	faqapp.directive('customFooter',function(){
 	return{
 		restrict: 'E',
 		templateUrl: "footer.html"
 	}
 	});




})();