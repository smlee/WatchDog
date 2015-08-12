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
    $scope.play = function(){
        SoundFactory.bark.play();
        //console.log('PLAY');
    };

    $scope.stop = function(){
        SoundFactory.bark.stop();
        //console.log('STOP');
    };

    //initialize();

});
