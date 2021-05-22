const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// restaurant schema
const restaurantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  image: { type: String },
  type: { type: String, required: true, trim: true, enum: ['veg', 'non-veg'] },
  ownerName: { type: String },
  mobile: { type: String, required: true, trim: true, unique: true },
  landline: { type: String, trim: true },
  costFor: { type: Number, },
  address: {
    address: { type: String, required: true, trim: true },// k-81, arihant arden
    landmark: { type: String, required: true, trim: true }, // near bishrakh
    city: { type: String, required: true, trim: true }, // greater noida west
    state: { type: String, required: true, trim: true }, // up
    pincode: { type: String, required: true, trim: true }, // 201306
    location: {
      lat: { type: String },
      lng: { type: String }
    }
  },
  menus: [
    {
      title: { type: String, required: true, default: "" },
      slug: { type: String, required: true, default: (a) => console.log(a) },
      active: { type: Boolean, default: true, }
    }
  ],
}, {
  toJSON: {
    transform(doc, _ret) {
      delete _ret.__v;
    }
  },
  timestamps: true
})



module.exports = mongoose.model("Restaurant", restaurantSchema);