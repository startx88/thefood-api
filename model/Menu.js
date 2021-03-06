const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// menu schema
const menuSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  title: { type: String, required: true },
  price: { type: Number, default: 0 },
  offer: { type: Number, default: 0 },
  slug: { type: String, required: true },
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
});

// menu schema
module.exports = mongoose.model("Menu", menuSchema);