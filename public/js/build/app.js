var app = angular.module('app', ['ngRoute', 'firebase', 'uiGmapgoogle-maps'])
	app.config(['$interpolateProvider','$routeProvider', 'uiGmapGoogleMapApiProvider', function ($interpolateProvider, $routeProvider, uiGmapGoogleMapApiProvider){
            uiGmapGoogleMapApiProvider.configure({
            	key: 'AIzaSyBcwSefNOCksg0CrkHZo58QPKBggYLrFIc',
            	v: '3.20',
            	libraries: 'places'
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
 				$scope.map = {}
 				$scope.map.center = { latitude: 45, longitude: -73 };
 				$scope.map.zoom =  8
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

	app.controller('gymSearchController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams','$location', 'Map', function($scope, $rootScope, $firebaseObject, $routeParams, $location, Map){ 
   			if(!$scope.user){
 				$location.path('/');
 			}else{
    console.log($scope.gymSearch);
    $scope.place = {};
        Map.search($scope.gymSearch)
        .then(
            function(res) { // success
                Map.addMarker(res);
                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    
    $scope.send = function() {
        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);    
    }
    
    Map.init();
	}
}]); 

// =============================== SERVICES ====================================



app.service('Map', function($q) {
    
    this.init = function() {
        var options = {
            center: new google.maps.LatLng($scope.user.lat, $scope.user.long),
            zoom: 8,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.search = function(str) {
        var d = $q.defer();
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
