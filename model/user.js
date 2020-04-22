const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('../config')
const Schema = mongoose.Schema;

const authSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, },
    avatar: { type: String },
    active: { type: Boolean, default: true },
    insertAt: { type: Date, default: Date.now }
});


// HASHED PASSWORD
authSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

// HASHED PASSWORD
authSchema.statics.comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}

// GENERATE TOKEN
authSchema.statics.generateToken = (user) => {
    return jwt.sign({ email: user.email, userId: user._id }, config.secret_key, { expiresIn: '1h' })
}

// DEGENERATE TOKEN
authSchema.statics.verifyToken = (token) => {
    return jwt.verify(token, config.secret_key)
}

module.exports = mongoose.model("User", authSchema)