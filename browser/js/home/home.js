app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('WatchDogCtrl', function($scope){
	$scope.watch = false;
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
    $scope.guard = function(){
    	$scope.watch = true;
    	$scope.getGeo();
    	$scope.initialLocation = $scope.location;
    	$scope.currentLocation();
    	while($scope.watch){
	    	if($scope.location !== $scope.initialLocation){
	    		alert('Geolocation has changed!');
	    		return $scope.location;
	    	};
    	}
    }
});
