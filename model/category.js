const monoose = require("mongoose");
const Schema = monoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    active: { type: Boolean, default: true },
    insertAt: { type: Date, default: Date.now }
})

module.exports = monoose.model('Category', CategorySchema)