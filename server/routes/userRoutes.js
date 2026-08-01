const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, "user-" + req.user.id + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images only!");
    }
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, currency } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email, currency }, { new: true, runValidators: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/upload-photo", auth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload a file" });
    const user = await User.findByIdAndUpdate(req.user.id, { profilePicture: req.file.filename }, { new: true });
    res.json({ url: "/uploads/" + req.file.filename, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
