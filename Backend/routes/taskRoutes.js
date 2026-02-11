const express = require("express");
const {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  updateStatus
} = require("../controllers/taskController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", verifyToken, addTask);
router.get("/", verifyToken, getTasks);
router.put("/update/:id", verifyToken, updateTask);
router.delete("/delete/:id", verifyToken, deleteTask);
router.put("/status/:id", verifyToken, updateStatus);

module.exports = router;
