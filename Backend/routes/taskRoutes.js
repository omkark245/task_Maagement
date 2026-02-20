const express = require("express");
const {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  updateStatus
} = require("../controllers/taskController");

const { verifyToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }
});

const router = express.Router();

router.post("/add", verifyToken, addTask);
router.get("/", verifyToken, getTasks);
router.put("/update/:id", verifyToken, updateTask);
router.delete("/delete/:id", verifyToken, deleteTask);
router.put("/status/:id", verifyToken, upload.fields([{ name: 'task_image', maxCount: 1 }, { name: 'task_file', maxCount: 1 }]), updateStatus);

module.exports = router;
