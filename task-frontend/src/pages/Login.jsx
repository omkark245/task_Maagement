import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center auth-bg">
            <div className="row w-100 justify-content-center">
                <div className="col-lg-9 col-md-10">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden auth-card">
                        <div className="row g-0">
                            {/* Left Side Branding */}
                            <div className="col-md-6 d-none d-md-flex bg-primary text-white p-5 flex-column justify-content-center">
                                <h2 className="fw-bold mb-3">Task Manager</h2>
                                <p className="mb-4 fs-6">
                                    Manage tasks easily, assign work, track progress, and complete
                                    projects faster with a modern dashboard.
                                </p>

                                <ul className="list-unstyled">
                                    <li className="mb-2">✅ Task Status Tracking</li>
                                    <li className="mb-2">✅ Admin Task Assignment</li>
                                    
                                </ul>

                                <div className="mt-4">
                                    <small className="text-white-50">
                                        © {new Date().getFullYear()} Task Manager System
                                    </small>
                                </div>
                            </div>

                            {/* Right Side Login Form */}
                            <div className="col-md-6 p-5 bg-white">
                                <h3 className="fw-bold text-dark">Welcome Back 👋</h3>
                                <p className="text-muted mb-4">
                                    Login to continue managing your tasks.
                                </p>

                                <form onSubmit={handleLogin}>
                                    {/* Email */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-envelope-fill"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-lock-fill"></i>
                                            </span>
                                            <input
                                                type={showPass ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setShowPass(!showPass)}
                                            >
                                                {showPass ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="remember"
                                            />
                                            <label className="form-check-label" htmlFor="remember">
                                                Remember me
                                            </label>
                                        </div>

                                        <span className="text-primary fw-semibold" style={{ cursor: "pointer" }}>
                                            Forgot Password?
                                        </span>
                                    </div>

                                    {/* Button */}
                                    <button className="btn btn-primary w-100 fw-bold py-2 rounded-3 auth-btn">
                                        Login
                                    </button>
                                </form>

                                {/* Signup Link */}
                                <p className="text-center mt-4 mb-0 text-muted">
                                    Don’t have an account?{" "}
                                    <Link to="/signup" className="fw-bold text-primary">
                                        Signup
                                    </Link>
                                </p>

                                {/* Admin Info */}
                                <div className="alert alert-light border mt-4 small">
                                    <b>Admin Demo:</b> admin@gmail.com <br />
                                    <b>Password:</b> admin123
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Branding */}
                    <div className="text-center mt-3 d-md-none">
                        <small className="text-muted">
                            Task Manager System | Secure Login Portal
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
