app.factory('SoundFactory', function () {
    return {
        bark: new Howl({
            urls: ['/sounds/dog_german_shepherd_dog_barking_inside_kennel.mp3']
        }),
        growl: new Howl({
            urls: ['/sounds/growl.mp3']
        })
    }
});
