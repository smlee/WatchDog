app.factory('Uploader', function($http){

    return {
        upload: function(base64, geo) {
            var reader = new window.FileReader();
            //var base64data;
            //reader.readAsDataURL(base64);
            //reader.onloadend = function() {
            //    base64data = reader.result;
            //    console.log(base64data);
            //};
            $http.post('/upload',{image: base64, geo: geo}).then(function(res){

            }, function(err){
                console.log(err);
            });
        }
    }
});
