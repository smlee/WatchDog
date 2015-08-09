app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('watch', {
        url: '/watch',
        controller: 'WatchController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('WatchController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);

    $scope.capture = function(){
        var video = document.getElementsByClassName('webcam-live')[0];
        var capturebutton = document.getElementById('capture-button');

        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height);

        var img = document.createElement("img");
        img.src = canvas.toDataURL();
        capturebutton.appendChild(img);
    };

    $scope.watch = false;
	$scope.location = {};
	$scope.currentLocation = function(){
		navigator.geolocation.getCurrentPosition(function(position){
			$scope.location.latitude = position.coords.latitude;
            $scope.location.longitude = position.coords.longitude;
            console.log('LOCATION:', $scope.location);
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
    
    $scope.currentLocation();

    $scope.guard = function(){
    	$scope.watch = true;
    	$scope.getGeo();
    	$scope.initialLocation = $scope.location;
    	$scope.currentLocation();
    	// while($scope.watch){
	    // 	if($scope.location !== $scope.initialLocation){
	    // 		alert('Geolocation has changed!');
	    // 		return $scope.location;
	    // 	};
    	// }
    }

});
