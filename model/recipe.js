const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// recipe schema
const recipeSchema = new Schema({
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, required: true, enum: ['veg', 'non-veg'] },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    offer: { type: Number, required: true, default: 0 },
    menu: { type: String, required: true },
    //category: { type: Schema.Types.ObjectId, ref: 'Category' },
    note: { type: String, },
    //subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', null: true },
    ingredients: [{
        name: { type: String },
        qty: { type: Number },
        unit: { type: String }
    }],
    image: { type: String },
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