import { useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);

      // 🔑 ROLE-BASED REDIRECT (FIX)
      if (user.role === "admin") {
        navigate("/admin/places", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      console.error(err.response?.data);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

        <form className="auth-form" onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <button className="auth-button">Login</button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <span onClick={onSwitch}>Sign up</span>
        </div>
      </div>
    </div>
  );
}
