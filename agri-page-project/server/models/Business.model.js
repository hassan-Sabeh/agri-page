// const {Schema, model, mongoose } = require('mongoose');
const mongoose = require('mongoose');
const User = require("./User.model.js");

const businessSchema = new mongoose.Schema(
    {
        owner_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
        business_name: {
            type: String,
            minlength: 1,
            maxlength: 20,
        },
        business_address: {
            type: String,
        },
        business_coordinates:{
            long: String,
            lat: String,
        },
        business_description: {
            type:String,
            maxlength: 200,
        },
        region: String
      }
);

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;