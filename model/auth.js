const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, },
    avatar: { type: String },
    active: { type: Boolean, default: true },
    insertAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", authSchema)