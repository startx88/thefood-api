const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Cuisine type
const cuisineSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
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
  timestamps: true
})

// export
module.exports = mongoose.model("Cuisine", cuisineSchema);