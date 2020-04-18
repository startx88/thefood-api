const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        unit: { type: String }
    }],
    image: { type: String },
    active: { type: Boolean, default: true },
    insertAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recipe", recipeSchema);