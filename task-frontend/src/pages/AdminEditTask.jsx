import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskImage, setTaskImage] = useState(null);
  const [taskFile, setTaskFile] = useState(null);

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  const fetchTaskDetails = async () => {
    const res = await API.get("/admin/tasks");
    const task = res.data.find((t) => t.id === parseInt(id));

    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setAssignedTo(task.assigned_to);
      setTaskImage(task.task_image);
      setTaskFile(task.task_file);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTaskDetails();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await API.put(`/admin/task/${id}`, {
      title,
      description,
      status,
      assigned_to: assignedTo
    });

    alert("Task Updated Successfully!");
    navigate("/admin");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 border-0">
        <h3 className="fw-bold mb-3">Update Task (Admin)</h3>

        <form onSubmit={handleUpdate}>
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

          <div className="mb-3">
            <label className="fw-semibold">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {taskImage && (
            <div className="mb-3">
              <label className="fw-semibold d-block">Uploaded Image</label>
              <img
                src={`http://localhost:5000/uploads/${taskImage}`}
                alt="Task"
                className="img-thumbnail"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

          {taskFile && (
            <div className="mb-3">
              <label className="fw-semibold d-block">Uploaded File</label>
              <a
                href={`http://localhost:5000/uploads/${taskFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary"
              >
                View File
              </a>
            </div>
          )}

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

          <button className="btn btn-success fw-bold w-100">
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditTask;
