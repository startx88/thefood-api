const monoose = require("mongoose");
const Schema = monoose.Schema;

const SubcategorySchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    active: { type: Boolean, default: true },
    insertAt: { type: Date, default: Date.now }
})

module.exports = monoose.model('Subcategory', SubcategorySchema)