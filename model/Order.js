const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Order schema
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  recipe: { type: ObjectId, required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  active: { type: Boolean, default: true },
  insertAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete _ret.__v;
    }
  },
  timestamps: true
});

module.exports = mongoose.model("Recipe", orderSchema);