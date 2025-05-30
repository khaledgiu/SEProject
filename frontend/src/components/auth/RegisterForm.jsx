import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../Toast";
import "./AuthForms.css"; // Shared auth form styles

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "standard", // Default role
  });

  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: "Passwords don't match!", type: "error" });
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      setToast({ message: "Registration successful! Welcome to EventTick.", type: "success" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setToast({ message: error || "Registration failed. Please try again.", type: "error" });
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create Account</h2>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Account Type</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Event Attendee</option>
            <option value="organizer">Event Organizer</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>
      <div className="auth-links">
        Already have an account? <Link to="/login">Sign In</Link>
        <div className="admin-link">
          Are you an admin? <Link to="/admin/register">Register as Admin</Link>
        </div>
      </div>
    </div>
  );
}
