import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const TaskCard = ({ task, onDelete, onEdit, onStatusChange }) => {
  const [showUploads, setShowUploads] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const handleStatusUpdate = (e) => {
    const newStatus = e.target.value;
    if (newStatus === "done") {
      setShowUploads(true);
    } else {
      setShowUploads(false);
      onStatusChange(task.id, newStatus);
    }
  };

  const handleComplete = () => {
    onStatusChange(task.id, "done", image, file);
    setShowUploads(false);
  };

  return (
    <div className="card shadow-sm mb-3 border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5 className="fw-bold">{task.title}</h5>
          <StatusBadge status={task.status} />
        </div>

        <p className="text-muted">{task.description}</p>

        <div className="d-flex justify-content-between align-items-center">
          <select
            className="form-select w-50"
            value={task.status}
            onChange={handleStatusUpdate}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="done">Done</option>
          </select>

          <div>
            <button
              className="btn btn-sm btn-outline-warning me-2"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>

        {showUploads && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h6>Upload Proof of Completion</h6>
            <div className="mb-2">
              <label className="small fw-bold">Image:</label>
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="mb-2">
              <label className="small fw-bold">File:</label>
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button
              className="btn btn-sm btn-success w-100"
              onClick={handleComplete}
            >
              Submit Completion
            </button>
          </div>
        )}

        <p className="mt-2 mb-0 text-secondary small">
          Created: {new Date(task.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;
