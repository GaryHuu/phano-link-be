const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      require: true,
      trim: true,
    },
    role: {
      type: String, // admin | user
      required: true,
      default: 'user',
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Users', usersSchema)
