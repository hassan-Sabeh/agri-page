const {Schema, model, Mongoose } = require('mongoose');

const businessSchema = new Schema(
    {
        owner_id:{type: Mongoose.Schema.Types.ObjectId, ref: 'User'},
        business_name: {},
        business_address: {},
        business_coordinates:{},
        business_description: {},
        region: {}
      }
);

const Business = model('Business', businessSchema);

module.exports = Business;