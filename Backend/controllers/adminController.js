const db = require("../db");

exports.getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email, role FROM users WHERE role='user'";

  db.query(sql, (err, users) => {
    if (err) return res.status(500).json(err);

    res.json(users);
  });
};

exports.getAllTasks = (req, res) => {
  const sql = `
    SELECT tasks.*, 
    u1.name AS assigned_user,
    u2.name AS created_user
    FROM tasks
    LEFT JOIN users u1 ON tasks.assigned_to = u1.id
    LEFT JOIN users u2 ON tasks.created_by = u2.id
  `;

  db.query(sql, (err, tasks) => {
    if (err) return res.status(500).json(err);

    res.json(tasks);
  });
};

exports.assignTask = (req, res) => {
  const { title, description, assigned_to } = req.body;

  const sql =
    "INSERT INTO tasks (title, description, status, assigned_to, created_by) VALUES (?, ?, 'pending', ?, ?)";

  db.query(sql, [title, description, assigned_to, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task Assigned Successfully" });
  });
};

exports.deleteTaskAdmin = (req, res) => {
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id=?";

  db.query(sql, [taskId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task Deleted Successfully (Admin)" });
  });
};

exports.updateTaskAdmin = (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, assigned_to } = req.body;

  const sql =
    "UPDATE tasks SET title=?, description=?, status=?, assigned_to=? WHERE id=?";

  db.query(sql, [title, description, status, assigned_to, taskId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task Updated Successfully (Admin)" });
  });
};

exports.getNotifications = (req, res) => {
  const sql = "SELECT * FROM notifications ORDER BY created_at DESC";

  db.query(sql, (err, notifications) => {
    if (err) return res.status(500).json(err);

    res.json(notifications);
  });
};

exports.markNotificationRead = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE notifications SET is_read = TRUE WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Notification marked as read" });
  });
};
