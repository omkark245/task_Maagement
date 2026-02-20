import React, { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  const fetchTasks = async () => {
    const res = await API.get("/admin/tasks");
    setTasks(res.data);
  };

  const fetchNotifications = async () => {
    const res = await API.get("/admin/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
    fetchNotifications();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();

    await API.post("/admin/assign", {
      title,
      description,
      assigned_to: assignedTo
    });

    alert("Task Assigned Successfully!");

    setTitle("");
    setDescription("");
    setAssignedTo("");

    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    // This is no longer accessible via UI but kept for reference
    await API.delete(`/admin/task/${id}`);
    fetchTasks();
  };

  // Search Filter
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    await API.put(`/admin/notifications/${id}/read`);
    fetchNotifications();
  };

  return (
    <div className="d-flex">
      <Sidebar user={user} />

      <div className="flex-grow-1 bg-light min-vh-100">
        <Navbar title="Admin Dashboard" />

        <div className="container mt-4">
          {/* Notifications Section */}
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-primary position-relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {showNotifications && (
            <div className="card mb-4 shadow-sm border-0">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Notifications</h6>
                <button className="btn btn-sm btn-light" onClick={() => setShowNotifications(false)}>Close</button>
              </div>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <li className="list-group-item text-muted">No notifications</li>
                ) : (
                  notifications.map((n) => (
                    <li key={n.id} className={`list-group-item d-flex justify-content-between align-items-center ${!n.is_read ? 'bg-light font-weight-bold' : ''}`}>
                      <span className={!n.is_read ? 'fw-bold' : ''}>{n.message}</span>
                      {!n.is_read && (
                        <button className="btn btn-sm btn-link" onClick={() => handleMarkAsRead(n.id)}>Mark Read</button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          <div className="row">
            {/* Assign Task */}
            <div className="col-md-4">
              <div className="card shadow p-3 border-0">
                <h5 className="fw-bold">Assign Task</h5>

                <form onSubmit={handleAssignTask}>
                  <div className="mb-3">
                    <label className="fw-semibold">Task Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold">Assign To</label>
                    <select
                      className="form-select"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      required
                    >
                      <option value="">Select User</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button className="btn btn-success w-100 fw-bold">
                    Assign Task
                  </button>
                </form>
              </div>
            </div>

            {/* All Tasks */}
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">All Tasks</h4>

                <input
                  type="text"
                  className="form-control w-50"
                  placeholder="Search Task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover bg-white shadow-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Assigned</th>
                      <th>Proof</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>
                          <StatusBadge status={task.status} />
                        </td>
                        <td>{task.assigned_user || "Not Assigned"}</td>
                        <td>
                          {task.task_image && (
                            <a
                              href={`http://localhost:5000/uploads/${task.task_image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-info me-1"
                            >
                              Image
                            </a>
                          )}
                          {task.task_file && (
                            <a
                              href={`http://localhost:5000/uploads/${task.task_file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              File
                            </a>
                          )}
                          {!task.task_image && !task.task_file && "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => navigate(`/admin/edit-task/${task.id}`)}
                          >
                            Edit / Reassign
                          </button>
                          {/* Delete button removed */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {currentTasks.length === 0 && (
                  <p className="text-muted mt-2">No tasks found.</p>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-outline-primary me-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>

                  <span className="fw-bold mt-2">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className="btn btn-outline-primary ms-2"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
