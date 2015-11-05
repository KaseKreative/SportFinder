var app = angular.module('app', ['ngRoute', 'firebase', 'uiGmapgoogle-maps', 'ngGPlaces'])
	app.config(['$interpolateProvider','$routeProvider', 'uiGmapGoogleMapApiProvider', 'ngGPlacesAPIProvider', function ($interpolateProvider, $routeProvider, uiGmapGoogleMapApiProvider, ngGPlacesAPIProvider){
            uiGmapGoogleMapApiProvider.configure({
            	key: 'AIzaSyB3ckqP-H2hCxXE6YYh6RXFhebNHWH43Rc',
            	v: '3.20',
            	libraries: 'places'
            });
            ngGPlacesAPIProvider.setDefaults({
            	radius:5000,
            	types: 'gym',
            	nearbySearchKeys: ['name', 'reference', 'vicinity', 'rating', 'opening_hours', 'geometry'],
            	placeDetailsKeys: ['rating', 'opening_hours', 'geometry']
            });
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
            $routeProvider.when("/", {
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
            }).when("/gymSearch", {
            	templateUrl: "templates/gymSearch.html",
            	controller: "gymSearchController"
            }).otherwise({
                redirectTo: "/"
            })
	}]);


	app.controller('indexController', ['$scope', '$firebaseAuth', '$firebaseObject', '$rootScope', '$routeParams','$location', function($scope, $firebaseAuth, $firebaseObject, $rootScope, $routeParams, $location){
			 $scope.data = {};
			 var ref = new Firebase("https://thesportfinder.firebaseio.com/users");
			 $scope.authObj = $firebaseAuth(ref);
			 
			 console.log('step1');

			 $scope.facebook = function(){
			 	console.log('step2 + clicked');
			 	$scope.authObj.$authWithOAuthPopup('facebook').then(function(authData){
			 			if(authData){
			 				console.log('step3');
			 			var reff = new Firebase("https://thesportfinder.firebaseio.com/users/"+authData.uid);
			 			var reffObject = $firebaseObject(reff);
			 				reffObject.$loaded().then(function(data){
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
			 					$rootScope.user = authData.facebook;
			 					console.log('step4');
			 					$location.path('/TorT');
			 				}else{
			 					$rootScope.user = authData.facebook;
			 					$location.path('/searchDashboard');	
			 				}	
							}).catch(function(err){console.log('Error :', err);})
			 				
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
 					console.log('error : ', err);
 				})
 					console.log(reffObject);
 					
				}).catch(function(err){console.log('Error: ', err);});
				$location.path('/searchDashboard');
			}
		}
	}]);

	app.controller('TorTController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', function($scope, $rootScope, $firebaseObject, $routeParams, $location){ 
			if(!$scope.user){
 				$location.path('/');
 			}else{
 				console.log('step5');

 		$scope.trainee = function(){
 			var reff = new Firebase("https://thesportfinder.firebaseio.com/users/"+$scope.user.uid);
 			var reffObject = $firebaseObject(reff);
 			console.log(reffObject);
 			reffObject.$loaded().then(function(data){
 				reffObject.trainer = false;
 			reffObject.$save().then(function(ref){
 					console.log(ref);
 				}, function(err){
 					console.log('error : ', err);
 				})
 			}).catch(function(err){console.log('Error : ', err);});
 				$location.path('/userProfile');
 		}

 		$scope.trainer = function(){
 			var reff = new Firebase("https://thesportfinder.firebaseio.com/users/"+$scope.user.uid);
 			var reffObject = $firebaseObject(reff);

 			reffObject.$loaded().then(function(data){
 				reffObject.trainer = true;
 			reffObject.$save().then(function(ref){
 					console.log(ref);
 				}, function(err){
 					console.log('Error : ', err);
 				})
 			}).catch(function(err){console.log('Error : ',  err);});
 			$location.path('/userProfile');
 		}
	}
	}]);

	app.controller('searchDashboardController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', function($scope, $rootScope, $firebaseObject, $routeParams, $location){ 
		if(!$scope.user){
 				$location.path('/');
 			}else{
 				function showPosition(position) {
 					var lat = position.coords.latitude;
 					var long = position.coords.longitude;
 					$rootScope.user.lat = lat;
 					$rootScope.user.long = long;
 					console.log(lat ,'+', long);
 				}
 				navigator.geolocation.getCurrentPosition(showPosition);

 				$scope.searchGym = function(){
 					$rootScope.gymSearch = $scope.gym.search;
 					console.log($rootScope.gymSearch);
 					$location.path('/gymSearch');
 				}
 			}
	}]);

	app.controller('gymSearchController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', 'ngGPlacesAPI', 'uiGmapGoogleMapApi', 'Map', function($scope, $rootScope, $firebaseObject, $routeParams, $location, ngGPlacesAPI, uiGmapGoogleMapApi, Map){ 
   			if(!$scope.user){
 				$location.path('/');
 			}else{
 				$scope.map = {};

 				$scope.places = ngGPlacesAPI.nearbySearch({latitude: $scope.user.lat, longitude: $scope.user.long, name: $scope.gymSearch}).then(function(data){
 					console.log(data);
 					return data;
 				})

 				uiGmapGoogleMapApi.then(function(maps){
 					$scope.map.center = {latitude: $scope.user.lat, longitude: $scope.user.long}
 					$scope.map.zoom = 8;
 				});
 						Map.init($scope.user.lat, $scope.user.long);
 				
	}	
}]); 

// =============================== SERVICES ====================================



app.service('Map', function($q) {
    
    this.init = function(lat, long) {
        var options = {
            center: new google.maps.LatLng(lat, long),
            zoom: 8,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    	console.log('This is Places INIT :', this.places);
    }
    
    this.search = function(str) {
        var d = $q.defer();
        console.log('This is Places SEARCH :', this.places);
        console.log(str, '----------');
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});
