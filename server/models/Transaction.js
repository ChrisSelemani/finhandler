const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Please specify transaction type"]
  },
  amount: {
    type: Number,
    required: [true, "Please add amount"],
    min: [0, "Amount must be positive"]
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: [
      "salary", "freelance", "investment", "business",
      "food", "transport", "utilities", "entertainment", 
      "healthcare", "education", "shopping", "rent", 
      "insurance", "gifts", "other"
    ]
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
    maxlength: [200, "Description cannot be more than 200 characters"]
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly", null],
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  receipt: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
