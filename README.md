To create the task management application
Step 1 : create the folder (task management) than create the Backend and task_ frontend folder 
Backend folder in cmd to 
Command is – npm init -y
		    npm install express mysql2 cors dotenv bcryptjs jsonwebtoken
    npm install nodemon --save-dev 
Create folder backend/
backend/
│── server.js
│── db.js
│── .env
│── package.json
│
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   ├── adminRoutes.js
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   ├── adminController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
Step 2: Create Database in XAMPP
1.	CREATE DATABASE task_manager;

2.	CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user'
);
3.	CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pending','in-progress','done') DEFAULT 'pending',
  assigned_to INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

Step 3: React Frontend Folder Structure
npm create vite@latest task-frontend
•	React
•	JavaScript


To install package
cd task-frontend
npm install
npm install axios react-router-dom bootstrap
Now folder structure:
 

To run the backend 
Cmd node server.js
To run the frontend  - npm run dev

  
 
 
