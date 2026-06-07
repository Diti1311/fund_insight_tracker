const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  schemeCode: {
    type: String,
    required: true
  },

  schemeName: {
    type: String,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  addedAt: {
    type: Date,
    default: Date.now
  }
});

watchlistSchema.index(
  { schemeCode: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Watchlist",
  watchlistSchema
);