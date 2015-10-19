(function(){
	
	var footerApp = angular.module('footer',[]);

	footerApp.controller('FooterController', function($scope){
			$scope.isLoged = function(){
		if(document.cookie.indexOf('user') == -1){
			return false;
		}
			return true;
	};	
	});


})();