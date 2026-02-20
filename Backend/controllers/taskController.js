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

  let task_image = req.files && req.files.task_image ? req.files.task_image[0].filename : null;
  let task_file = req.files && req.files.task_file ? req.files.task_file[0].filename : null;

  let sql = "UPDATE tasks SET status=?";
  let params = [status];

  if (task_image) {
    sql += ", task_image=?";
    params.push(task_image);
  }
  if (task_file) {
    sql += ", task_file=?";
    params.push(task_file);
  }

  sql += " WHERE id=? AND assigned_to=?";
  params.push(taskId, req.user.id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (status === "done") {
      db.query(
        "SELECT title FROM tasks WHERE id = ?",
        [taskId],
        (err, taskResults) => {
          if (!err && taskResults.length > 0) {
            const taskTitle = taskResults[0].title;
            const notificationMsg = `Task "${taskTitle}" has been completed by ${req.user.name || 'a user'}.`;
            db.query(
              "INSERT INTO notifications (message) VALUES (?)",
              [notificationMsg]
            );
          }
        }
      );
    }

    res.json({ message: "Task Status Updated Successfully" });
  });
};

exports.getUserNotifications = (req, res) => {
  const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [req.user.id], (err, notifications) => {
    if (err) return res.status(500).json(err);

    res.json(notifications);
  });
};

exports.markUserNotificationRead = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";

  db.query(sql, [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Notification marked as read" });
  });
};
