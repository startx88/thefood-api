const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')



// auth schema
const authSchema = new Schema({
  firstname: { type: String, required: true, trim: true, },
  lastname: { type: String, required: true, trim: true, },
  email: { type: String, required: true, unique: true, trim: true, index: true },
  password: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true, unique: true, index: true },
  verify: { type: Boolean },
  active: { type: Boolean, default: true },
  role: { type: String, default: 'user', enum: ['admin', 'chef', 'partner', 'user'] },
  token: { type: String, },
  refereshToken: { type: String },
  tokenExpire: { type: String },
  insertAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    timestamps: true,
    transform(doc, ret) {
      ret.id = ret._id;
      ret.password = null;
      delete ret._id;
      delete ret.__v;
    }
  }
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

module.exports = mongoose.model("User", authSchema);
