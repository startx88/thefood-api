const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// cart schema
const discountSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  discountPercents: { type: Number, required: true },
  active: { type: Boolean, default: true },
  insertAt: { type: Date, default: Date.now }
}, {
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
  timestamps: true
})

// export
module.exports = mongoose.model('Discount', discountSchema);