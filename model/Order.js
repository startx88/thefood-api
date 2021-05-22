const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  recipeId: { type: ObjectId, required: true },
  quantity: { type: Number, required: true },
  active: { type: Boolean, default: true },
  insertAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recipe", orderSchema);