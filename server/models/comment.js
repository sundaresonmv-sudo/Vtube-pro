const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  userName: {
    type: String
  },

  city: {
    type: String
  },

  text: {
    type: String
  },

  likes: {
    type: Number,
    default: 0
  },

  dislikes: {
    type: Number,
    default: 0
  }

}, { timestamps: true })

module.exports =
  mongoose.models.Comment ||
  mongoose.model(
    "Comment",
    commentSchema
  )