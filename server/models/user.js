const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  mobile: {
    type: String
  },

  state: {
    type: String
  },

  city: {
    mobile: {
  type: String
},
    type: String
  },

  plan: {
    type: String,
    default: "free"
  },

  isPremium: {
    type: Boolean,
    default: false
  }
})

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema)