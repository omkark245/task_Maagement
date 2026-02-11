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

  useEffect(() => {
    fetchUsers();
    fetchTasks();
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

  return (
    <div className="d-flex">
      <Sidebar user={user} />

      <div className="flex-grow-1 bg-light min-vh-100">
        <Navbar title="Admin Dashboard" />

        <div className="container mt-4">
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
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => navigate(`/admin/edit-task/${task.id}`)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
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
