import { useState } from "react";
import API from "../api/api";
import "./Auth.css";

export default function Signup({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users", form);
      alert("Signup successful. Please login.");
      onSwitch(); // 🔑 switch back to login
    } catch (err) {
      console.error(err.response?.data);
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Join Travelogue and start discovering
        </p>

        <form className="auth-form" onSubmit={submit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button className="auth-button" type="submit">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <span onClick={onSwitch}>Login</span>
        </div>
      </div>
    </div>
  );
}
