const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.createTransaction = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search, sort = "-date", page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query["$or"] = [
        { description: { "$regex": search, "$options": "i" } },
        { tags: { "$regex": search, "$options": "i" } }
      ];
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date["$gte"] = new Date(startDate);
      if (endDate) query.date["$lte"] = new Date(endDate);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort(sort).skip(skip).limit(limitNum),
      Transaction.countDocuments(query)
    ]);

    res.json({
      transactions,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionStats = async (req, res) => {
  try {
    const { period = "monthly", year, month } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    let startDate, endDate;
    
    if (period === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (period === "monthly") {
      const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
      const targetYear = year ? parseInt(year) : now.getFullYear();
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 1);
    } else if (period === "annually") {
      const targetYear = year ? parseInt(year) : now.getFullYear();
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear + 1, 0, 1);
    }

    const summary = await Transaction.aggregate([
      { "$match": { user: userId, date: { "$gte": startDate, "$lt": endDate } } },
      { "$group": { _id: "$type", total: { "$sum": "$amount" }, count: { "$sum": 1 }, avgAmount: { "$avg": "$amount" } } }
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      { "$match": { user: userId, type: "expense", date: { "$gte": startDate, "$lt": endDate } } },
      { "$group": { _id: "$category", total: { "$sum": "$amount" }, count: { "$sum": 1 } } },
      { "$sort": { total: -1 } }
    ]);

    const dailyTotals = await Transaction.aggregate([
      { "$match": { user: userId, date: { "$gte": startDate, "$lt": endDate } } },
      { "$group": {
          _id: { "$dateToString": { format: "%Y-%m-%d", date: "$date" } },
          income: { "$sum": { "$cond": [{ "$eq": ["$type", "income"] }, "$amount", 0] } },
          expenses: { "$sum": { "$cond": [{ "$eq": ["$type", "expense"] }, "$amount", 0] } }
        }
      },
      { "$sort": { _id: 1 } }
    ]);

    res.json({ period, dateRange: { startDate, endDate }, summary, categoryBreakdown, dailyTotals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
