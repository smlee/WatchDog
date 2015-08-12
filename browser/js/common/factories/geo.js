app.factory('GeoFactory', function(){
    var location = {};
    return {
        currentLocation: function() {
            navigator.geolocation.getCurrentPosition(function(position){
                location.latitude = position.coords.latitude;
                location.longitude = position.coords.longitude;
                return location;
            })
        }
    }
});
