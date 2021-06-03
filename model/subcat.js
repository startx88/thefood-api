const monoose = require("mongoose");
const Schema = monoose.Schema;

// subcategory schema
const SubcategorySchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String },
    description: { type: String },
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
})

module.exports = monoose.model('Subcategory', SubcategorySchema)