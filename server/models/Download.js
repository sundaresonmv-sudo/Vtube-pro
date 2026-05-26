const mongoose = require("mongoose")

const downloadSchema =
  new mongoose.Schema({

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    videoTitle: {
      type: String
    },

    videoUrl: {
      type: String
    },

    downloadedAt: {
      type: Date,
      default: Date.now
    }

  })

module.exports =
  mongoose.models.Download ||
  mongoose.model(
    "Download",
    downloadSchema
  )