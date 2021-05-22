const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// auth schema
const profileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    dob: { type: String },
    avatar: { type: String },
    favoriteRestaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            null: true
        }
    ],
    address: {
        state: { type: String, required: true, trim: true }, // up
        city: { type: String, required: true, trim: true }, // greater noida west
        address: { type: String, required: true, trim: true },// k-81, arihant arden
        landmark: { type: String, required: true, trim: true }, // near bishrakh
        pincode: { type: String, required: true, trim: true }, // 201306
        location: {
            lat: { type: String },
            lng: { type: String }
        }
    },
}, {
    toJSON: {
        transform(doc, _ret, options) {
            delete _ret.__v;
        }
    },
    timestamps: true
});



module.exports = mongoose.model('Profile', profileSchema);