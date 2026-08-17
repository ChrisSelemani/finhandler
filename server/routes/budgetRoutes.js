const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// Get all budgets for current month
router.get("/", auth, async (req, res) => {
  try {
    const now = new Date();
    const budgets = await Budget.find({
      user: req.user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear()
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get budget status with spending
router.get("/status", auth, async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const budgets = await Budget.find({
      user: req.user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear()
    });

    const spending = await Transaction.aggregate([
      { "$match": { user: userId, type: "expense", date: { "$gte": startDate } } },
      { "$group": { _id: "$category", total: { "$sum": "$amount" } } }
    ]);

    const status = budgets.map(budget => {
      const spent = spending.find(s => s._id === budget.category)?.total || 0;
      const percentage = (spent / budget.limit) * 100;
      return {
        ...budget.toObject(),
        spent,
        percentage,
        remaining: budget.limit - spent,
        status: percentage >= 100 ? "exceeded" : percentage >= 80 ? "warning" : "ok"
      };
    });

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create budget
router.post("/", auth, async (req, res) => {
  try {
    const now = new Date();
    const budget = await Budget.create({
      ...req.body,
      user: req.user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear()
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update budget
router.put("/:id", auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete budget
router.delete("/:id", auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
