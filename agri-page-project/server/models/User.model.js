const { Schema, model, Mongoose } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    user_type: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    own_business: {type: Mongoose.Schema.Types.ObjectId, ref: 'Business', default: null},
    favorites: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Business'}],
    password: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
