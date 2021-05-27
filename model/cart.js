const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// cart schema
const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
  qty: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, {
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
})

// export
module.exports = mongoose.model('Cart', cartSchema);