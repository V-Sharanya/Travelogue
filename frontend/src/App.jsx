import { useState } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

function Home() {
  const { user, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // Not logged in → show auth pages
  if (!user) {
    return showSignup ? (
      <Signup onSwitch={() => setShowSignup(false)} />
    ) : (
      <Login onSwitch={() => setShowSignup(true)} />
    );
  }

  // Logged in → show app
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
