const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true,
    min: [0, "Budget limit must be positive"]
  },
  month: {
    type: Number,
    required: true,
    default: new Date().getMonth() + 1
  },
  year: {
    type: Number,
    required: true,
    default: new Date().getFullYear()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
