// const { Schema, model, mongoose } = require("mongoose");
const mongoose = require('mongoose');
const Business = require('./Business.model.js');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 16,
    },
    userType: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email address is not valid']
    },
    ownBusiness: {type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null},
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Business'}],
    hashPassword: {type: String, required: true}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
// model.call(require('mongoose'), 'User', userSchema)
module.exports = User;
