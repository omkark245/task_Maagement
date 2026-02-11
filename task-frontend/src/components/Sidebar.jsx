import React from "react";

const Sidebar = ({ user }) => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <h4 className="fw-bold text-center">Task Manager</h4>
      <hr />

      <p className="text-center mb-0">Welcome</p>
      <h6 className="text-center fw-bold">{user?.name}</h6>

      <p className="text-center text-warning mt-2">
        Role: {user?.role?.toUpperCase()}
      </p>
    </div>
  );
};

export default Sidebar;
