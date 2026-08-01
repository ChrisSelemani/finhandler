const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createTransaction,
  getTransactions,
  getTransactionStats,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

router.use(auth);

router.route("/").post(createTransaction).get(getTransactions);
router.get("/stats", getTransactionStats);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
