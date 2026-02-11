const express = require("express");
const {
  getAllUsers,
  getAllTasks,
  assignTask,
  deleteTaskAdmin,
  updateTaskAdmin
} = require("../controllers/adminController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/tasks", verifyToken, isAdmin, getAllTasks);

router.post("/assign", verifyToken, isAdmin, assignTask);

router.delete("/task/:id", verifyToken, isAdmin, deleteTaskAdmin);
router.put("/task/:id", verifyToken, isAdmin, updateTaskAdmin);

module.exports = router;
