app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('WatchDogCtrl', function($scope){
	$scope.location = {};
	$scope.currentLocation = function(){
		navigator.geolocation.getCurrentPosition(function(position){
			$scope.location.latitude = position.coords.latitude;
            $scope.location.longitude = position.coords.longitude;
            return $scope.location;
		})
	}
	$scope.getGeo = function (){
        if(navigator.geolocation){                          
        	$scope.currentLocation();
        } 
        else {
          alert("Geolocation is not supported by this browser");
        }
    };
    $scope.geoGuard = function(){
    	$scope.initialLocation = $scope.location;
    	$scope.currentLocation();
    	if($scope.location != $scope.initialLocation){
    		alert('Geolocation has changed!');
    		return $scope.location;
    	});
    }
     
});