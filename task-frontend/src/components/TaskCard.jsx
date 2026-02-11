import React from "react";
import StatusBadge from "./StatusBadge";

const TaskCard = ({ task, onDelete, onEdit, onStatusChange }) => {
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
            onChange={(e) => onStatusChange(task.id, e.target.value)}
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

        <p className="mt-2 mb-0 text-secondary small">
          Created: {new Date(task.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;
