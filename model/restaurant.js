const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// restaurant schema
const restaurantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  mobile: { type: String, required: true, trim: true, unique: true },
  website: { type: String, },
  landline: { type: String },
  description: { type: String },
  owner: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobile: { type: String, required: true, trim: true, unique: true, default: this.mobile },
  },
  manager: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobile: { type: String, required: true, trim: true, unique: true, default: this.mobile },
  },
  restaurantType: { type: String, enum: ['veg', 'nonveg', 'both'] },
  yearOfBirth: { type: Date, required: true, trim: true },
  servingType: { type: String, required: true, enum: ['dine-in', 'delivery', 'both'] },
  cuisines: { type: [String], required: true, trim: true },
  daysOpenInWeek: { type: [String] },
  from: { type: String },
  to: { type: String },
  openNow: { type: Boolean, required: true, default: true },
  menuImage: { type: String },
  costForTwo: { type: Number, },
  isClosed: { type: Boolean, default: false },
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
  active: { type: Boolean, default: true },
  insertAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  timestamps: true
})



module.exports = mongoose.model("Restaurant", restaurantSchema);

/**
 * name, address, location
 */