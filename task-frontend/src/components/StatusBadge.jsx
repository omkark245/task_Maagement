import React from "react";

const StatusBadge = ({ status }) => {
  const getColor = () => {
    if (status === "pending") return "danger";
    if (status === "in-progress") return "warning";
    if (status === "done") return "success";
    return "secondary";
  };

  return (
    <span className={`badge bg-${getColor()} text-uppercase`}>
      {status}
    </span>
  );
};

export default StatusBadge;
