const db = require("../db");

exports.addTask = (req, res) => {
  const { title, description } = req.body;

  const sql =
    "INSERT INTO tasks (title, description, status, assigned_to, created_by) VALUES (?, ?, 'pending', ?, ?)";

  db.query(sql, [title, description, req.user.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task Added Successfully" });
  });
};

exports.getTasks = (req, res) => {
  const sql =
    "SELECT tasks.*, users.name AS assigned_user FROM tasks LEFT JOIN users ON tasks.assigned_to = users.id WHERE tasks.assigned_to=?";

  db.query(sql, [req.user.id], (err, tasks) => {
    if (err) return res.status(500).json(err);

    res.json(tasks);
  });
};

exports.updateTask = (req, res) => {
  const { title, description } = req.body;
  const taskId = req.params.id;

  const sql =
    "UPDATE tasks SET title=?, description=? WHERE id=? AND assigned_to=?";

  db.query(sql, [title, description, taskId, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task Updated Successfully" });
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id=? AND assigned_to=?";

  db.query(sql, [taskId, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task Deleted Successfully" });
  });
};

exports.updateStatus = (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  const sql =
    "UPDATE tasks SET status=? WHERE id=? AND assigned_to=?";

  db.query(sql, [status, taskId, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task Status Updated Successfully" });
  });
};

