const { Schema, model, Mongoose } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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
    ownBusiness: {type: Mongoose.Schema.Types.ObjectId, ref: 'Business', default: null},
    favorites: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Business'}],
    password: {type: String, required: true}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
