const monoose = require("mongoose");
const Schema = monoose.Schema;

// category schema
const CategorySchema = new Schema({
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
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
});


// export
module.exports = monoose.model('Category', CategorySchema);