import React, { useEffect, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    await API.post("/tasks/add", { title, description });
    alert("Task Added Successfully!");

    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const handleDelete = async (id) => {
    await API.delete(`/tasks/delete/${id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleSaveEdit = async (updatedTask) => {
    await API.put(`/tasks/update/${updatedTask.id}`, {
      title: updatedTask.title,
      description: updatedTask.description
    });

    alert("Task Updated Successfully!");
    setShowModal(false);
    fetchTasks();
  };

  const handleStatusChange = async (id, status) => {
    await API.put(`/tasks/status/${id}`, { status });
    fetchTasks();
  };

  // Search filter
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="d-flex">
      <Sidebar user={user} />

      <div className="flex-grow-1 bg-light min-vh-100">
        <Navbar title="User Dashboard" />

        <div className="container mt-4">
          <div className="row">
            {/* Add Task */}
            <div className="col-md-4">
              <div className="card shadow p-3 border-0">
                <h5 className="fw-bold">Add New Task</h5>

                <form onSubmit={handleAddTask}>
                  <div className="mb-3">
                    <label className="fw-semibold">Title</label>
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

                  <button className="btn btn-primary w-100 fw-bold">
                    Add Task
                  </button>
                </form>
              </div>
            </div>

            {/* Task List */}
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">My Tasks</h4>

                <input
                  type="text"
                  className="form-control w-50"
                  placeholder="Search Task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {currentTasks.length === 0 ? (
                <p className="text-muted">No tasks found.</p>
              ) : (
                currentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}

              {/* Pagination Buttons */}
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

        {/* Edit Modal */}
        <EditTaskModal
          show={showModal}
          onClose={() => setShowModal(false)}
          task={selectedTask}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
