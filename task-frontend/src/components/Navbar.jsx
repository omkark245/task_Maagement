import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand fw-bold">{title}</span>

      <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
