app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('watch', {
        url: '/watch',
        controller: 'WatchController',
        templateUrl: 'js/watch/watch.html'
    });

});

app.controller('WatchController', function ($scope, Uploader, SoundFactory, CamFactory, GeoFactory) {

    $scope.$on('$viewContentLoaded', function(){
        CamFactory.initialize();
    });

    $scope.watch = CamFactory.getWatch();

    function requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    $scope.getGeo = function (){
        if(navigator.geolocation){
            GeoFactory.currentLocation();
        }
        else {
            alert("Geolocation is not supported by this browser");
        }
    };

    $scope.guard = function(){
        requestFullScreen(document.body);
        setTimeout(function() {
            CamFactory.setWatch();
            $scope.initialLocation = $scope.getGeo();
        },10000);
        $scope.watch = true;
    };

    // THE BARK

    $scope.barking = false;

    $scope.play = function(){
        SoundFactory.bark.play();
        $scope.barking = true;
        console.log('BARK', $scope.barking);
    };

    $scope.stop = function(){
        SoundFactory.bark.stop();
        $scope.barking = false;
        console.log('BARK', $scope.barking);
    };

    //initialize();

});
