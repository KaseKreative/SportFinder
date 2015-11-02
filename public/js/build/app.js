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
            }).when("/TorT",{
            	templateUrl: "templates/TorT.html",
            	controller:  "TorTController"
            }).when("/searchDashboard", {
            	templateUrl: "templates/searchDashboard.html",
            	controller: "searchDashboardController"
            }).otherwise({
                redirectTo: "/"
            })
	}]);


	app.controller('indexController', ['$scope', '$firebaseAuth', '$firebaseObject', '$rootScope', '$routeParams','$location', function($scope, $firebaseAuth, $firebaseObject, $rootScope, $routeParams, $location){
			 $scope.data = {};
			 var ref = new Firebase("https://thesportfinder.firebaseio.com/users");
			 $scope.authObj = $firebaseAuth(ref);
			 



			 console.log('bloop');
			 $scope.facebook = function(){
			 		console.log('bloop2');
			 		$scope.authObj.$onAuth(function(authData){
			 			if(authData){
			 			var reff = new Firebase("https://thesportfinder.firebaseio.com/users/"+authData.uid);
			 			var reffObject = $firebaseObject(reff);
			 			console.log(reffObject);
			 				reffObject.$loaded().then(function(data){
			 					console.log(data);
							if(data.uid == undefined){
								authData.facebook.uid = authData.uid;
			 				var userData = authData.facebook.cachedUserProfile;
			 					reff.set({
			 					facebookID : userData.id,
			 					firstName  : userData.first_name,
			 					lastName   : userData.last_name,
			 					name       : userData.name,
			 					gender     : userData.gender,
			 					link       : userData.link,
			 					imgUrl     : userData.picture.data.url,
			 					uid        : authData.uid
			 					});
			 					$location.path('/TorT')
			 				}
							}).catch(function(err){console.log('Error :', err);})
			 				
			 		$rootScope.user = authData.facebook;
			 		$location.path('/searchDashboard');
			 			}	
			 		})
			 };

	}]);



	app.controller('profileController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', function($scope, $rootScope, $firebaseObject, $routeParams, $location){ 
 			if(!$scope.user){
 				$location.path('/');
 			}else{




 			$scope.saveChanges = function(){
 				var reff = new Firebase("https://thesportfinder.firebaseio.com/users/"+$scope.user.uid);
 				var reffObject = $firebaseObject(reff);
 				reffObject.$loaded().then(function(data){
 					console.log(data);
 					reffObject.description = $scope.user.description;
 				reffObject.$save().then(function(ref){
 					console.log(ref);
 				}, function(err){
 					console.log('error :', err);
 				})
 					console.log(reffObject);
 					$location.path('/TorT');
				}).catch(function(err){console.log('Error: ', err)});
			}
		}
	}]);

	app.controller('TorTController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', function($scope, $rootScope, $firebaseObject, $routeParams, $location){ 
			if(!$scope.user){
 				$location.path('/');
 			}else{

		$scope.profilePage = function(){
			$location.path('/userProfile');
		}
	}
	}]);

	app.controller('searchDashboardController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', function($scope, $rootScope, $firebaseObject, $routeParams, $location){ 
		if(!$scope.user){
 				$location.path('/');
 			}else{

 			}
	}]) 

// =============================== SERVICES ====================================
