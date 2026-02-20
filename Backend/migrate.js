require("dotenv").config();
const db = require("./db");

const migrate = async () => {
  const queries = [
    "ALTER TABLE tasks ADD COLUMN task_image VARCHAR(255) DEFAULT NULL",
    "ALTER TABLE tasks ADD COLUMN task_file VARCHAR(255) DEFAULT NULL",
    "CREATE TABLE IF NOT EXISTS notifications (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT DEFAULT NULL, message TEXT NOT NULL, is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "ALTER TABLE notifications ADD COLUMN user_id INT DEFAULT NULL"
  ];

  for (const query of queries) {
    try {
      await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
              console.log("Column already exists, skipping...");
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log("Query executed successfully:", query);
            resolve();
          }
        });
      });
    } catch (err) {
      console.error("Migration failed:", err.message);
    }
  }
  db.end();
};

migrate();
