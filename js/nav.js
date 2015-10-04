(function() {
	var app = angular.module('navBar', []);

	app.directive('navBar',function{
	return{
		restrict: 'E',
		templateUrl : '../nav.html'
	};
});
})();