var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photo_url: {
        type: [String]
    },
    geo:{
        type: []
    }
});
