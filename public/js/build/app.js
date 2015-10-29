var app = angular.module('app', ['ngRoute', 'firebase'])
	app.config(['$interpolateProvider','$routeProvider', function ($interpolateProvider, $routeProvider){
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
            $routeProvider.when("/",{
                templateUrl: "templates/index.html",
                controller: "indexController"
            }).when("/userProfile", {
            	templateUrl: "templates/profile.html",
            	controller: "profileController"
            }).otherwise({
                redirectTo: "/"
            })
	   }]);


	app.controller('indexController', ['$scope', '$firebaseAuth', '$firebaseArray', '$rootScope', '$routeParams','$location', function($scope, $firebaseAuth, $firebaseArray, $rootScope, $routeParams, $location){
			 $scope.data = {};
			 var ref = new Firebase("https://thesportfinder.firebaseio.com/users");
			 $scope.authObj = $firebaseAuth(ref);


			 
			 $scope.facebook = function(){
			 	$scope.authObj.$authWithOAuthPopup('facebook').then(function(authData){
			 		
			 		ref = new Firebase("https://thesportfinder.firebaseio.com/users/"+authData.uid);
			 		$scope.users = $firebaseArray(ref);
			 		authData.facebook.uid = authData.uid;
			 		$scope.users.$add(authData.facebook);
			 		$rootScope.user = authData.facebook;
			 		$location.path('/userProfile');
			 		console.log(authData);
			 		console.log($scope.user);
			 	})
			 };

	}]);



	app.controller('profileController', ['$scope', '$rootScope', '$routeParams','$location', function($scope, $rootScope, $routeParams, $location){ 
 			if(!$scope.user){
 				$location.path('/');
 			}
 			console.log($scope.user);
 			// itemArray.$bindTo($scope, "data");
			 // $scope.addItem = function(){
			 // itemObject.item2= {'itemName': 'The Name 2'};
			 // itemObject.$save();
			 // console.log(itemObject);
			 	// itemArray.$add({
			 	// 		random : $scope.data.text
			 	// });

	}]);




// =============================== SERVICES ====================================
