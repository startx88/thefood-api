const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// recipe schema
const recipeSchema = new Schema({
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true },
    recipeType: { type: String, required: true, enum: ['veg', 'nonveg'] },
    cuisineType: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    offer: { type: Number, default: 0 },
    note: { type: String },
    ingredients: [{
        name: { type: String },
        qty: { type: Number },
        unit: { type: String }
    }],
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


// export
module.exports = mongoose.model("Recipe", recipeSchema);