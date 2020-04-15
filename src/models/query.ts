const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        required : true,
        trim : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps : true
})

export const Query = mongoose.model('Query', querySchema); 