// const {Schema, model, mongoose } = require('mongoose');
const mongoose = require('mongoose');
const User = require("./User.model.js");

const businessSchema = new mongoose.Schema(
    {
        ownerId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
        businessName: {
            type: String,
            minlength: 1,
            maxlength: 20,
            unique: true,
        },
        businessAddress: {
            type: String,
            default: null,
        },
        businessCoordinates:{
            long: String,
            lat:  String,
        },
        businessDescription: {
            type:String,
            maxlength: 200,
            default: null,
        },
        region: String,
      }
);

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;