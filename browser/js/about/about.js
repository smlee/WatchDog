app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('watch', {
        url: '/watch',
        controller: 'WatchController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('WatchController', function ($scope, Uploader) {

    var isGaurding = false;

    $scope.watch = false;

    $scope.location = {};
    $scope.currentLocation = function(){
        navigator.geolocation.getCurrentPosition(function(position){
			$scope.location.latitude = position.coords.latitude;
            $scope.location.longitude = position.coords.longitude;
            //console.log('LOCATION:', $scope.location);
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

    $scope.capture = function(){
        var video = document.getElementsByClassName('webcam-live')[0];
        var capturebutton = document.getElementById('capture-button');

        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        //canvas.getContext('2d')
        //    .drawImage(video, 0, 0, canvas.width, canvas.height);

        var img = document.createElement("img");
        img.src = canvas.toDataURL();
        Uploader.upload(img.src, $scope.getGeo());
    };

    /**
     * Based on https://timtaubert.de/demos/motion-detection/
     */

    var video, width, height, context;
    var bufidx = 0, buffers = [];



    function readFrame() {
        try {
            context.drawImage(video, 0, 0, width, height);
        } catch (e) {
            // The video may not be ready, yet.
            return null;
        }

        return context.getImageData(0, 0, width, height);
    }

    function draw() {
        var frame = readFrame();

        if (frame) {
            markLightnessChanges(frame.data);
            context.putImageData(frame, 0, 0);
        }

        // Wait for the next frame.
        requestAnimationFrame(draw);
    }

    function startStream(stream) {
        video.src = URL.createObjectURL(stream);
        video.play();

        // Ready! Let's start drawing.
        requestAnimationFrame(draw);
    }


    function initialize() {
        // The source video.
        video = document.getElementById("v");
        width = video.width;
        height = video.height;

        // The target canvas.
        var canvas = document.getElementById("c");
        console.log(canvas);
        context = canvas.getContext("2d");

        // Prepare buffers to store lightness data.
        for (var i = 0; i < 2; i++) {
            buffers.push(new Uint8Array(width * height));
        }

        // Get the webcam's stream.
        navigator.getUserMedia({video: true}, startStream, function () {});
    }

    var isHTriggered = false;
    var isLTriggered = false;
    var htc = 0, ltc = 0, htt, ltt;

    function hManage() {
        $scope.capture();
        isHTriggered = true;
    }

    function markLightnessChanges(data) {
        // Pick the next buffer (round-robin).
        var buffer = buffers[bufidx++ % buffers.length];
        var h = 0;
        var l = 0;

        for (var i = 0, j = 0; i < buffer.length; i++, j += 4) {
            // Determine lightness value.
            var current = lightnessValue(data[j], data[j + 1], data[j + 2]);

            // Set color to black.
            data[j] = data[j + 1] = data[j + 2] = 0;

            // Full opacity for changes.
            data[j + 3] = 255 * lightnessHasChanged(i, current);
            if (lightnessHasChanged(i, current) && isGaurding){
                if (current > 70) {
                    //start counting high risk activities
                    h++;
                    console.log("h",h);

                    //if there is too much high risk triggers send phone call and text message to user
                    if (h > 200 && !isHTriggered) hManage();

                } else {
                    //start counting low risk triggers
                    l++;

                    //if there are over 500 low risk triggers send text to user
                    if (l > 500 && !isLTriggered && !isHTriggered){
                        $scope.capture();
                        isLTriggered = true;
                    }

                }
            }

            // Store current lightness value.
            buffer[i] = current;
        }
    }

    function lightnessHasChanged(index, value) {
        return buffers.some(function (buffer) {
            return Math.abs(value - buffer[index]) >= 50; //15 is original value
        });
    }

    function lightnessValue(r, g, b) {
        return (Math.min(r, g, b) + Math.max(r, g, b)) / 255 * 50;
    }

    initialize();


    // THE BARK
    var music = new Howl({
      urls: ['/sounds/dog_german_shepherd_dog_barking_inside_kennel.mp3']
    });

    console.log("loading", music);

    $scope.play = function(){
        music.play();
        console.log('PLAY');
    };

    $scope.stop = function(){
        music.stop();
        console.log('STOP');
    };

});
