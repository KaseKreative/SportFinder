var app = angular.module('app', ['ngRoute'])
	app.config(['$interpolateProvider','$routeProvider', function ($interpolateProvider, $routeProvider){
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
            $routeProvider
            .when("/",{
                templateUrl: "templates/index.html",
                controller: "indexController"
            }).otherwise({
                redirectTo: "/"
            })
	   }]);


	app.controller('indexController', ['$scope', '$rootScope', '$http', '$routeParams','$location' function($scope, $rootScope, $http, $routeParams, $location){
        $http.post('/getDegrees', $scope.allDegrees)
        .then(function(res){
            $rootScope.theSession = 0;
            myService.addItem(res.data);
            $location.path('/getRubrics');
        });
	}]);