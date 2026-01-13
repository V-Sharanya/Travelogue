import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import { useState } from "react";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

import RequireAdmin from "./auth/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import PlacesList from "./admin/Places/PlacesList";
import AddPlace from "./admin/Places/AddPlace";

/* ---------------- AUTH PAGES ---------------- */

function AuthPages() {
  
  const [showSignup, setShowSignup] = useState(false);

  return showSignup ? (
    <Signup onSwitch={() => setShowSignup(false)} />
  ) : (
    <Login onSwitch={() => setShowSignup(true)} />
  );
}

/* ---------------- HOME ---------------- */

function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user.name}</h2>

      {user.role === "admin" && (
        <div style={{ marginBottom: "1rem" }}>
          <a href="/admin/places">
            <button>Go to Admin Dashboard</button>
          </a>
        </div>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}


/* ---------------- ROUTES ---------------- */
function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>User Dashboard</h2>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // ⏳ WAIT until auth is resolved
  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <AuthPages />;
  }

  return (
    <Routes>
      {/* 🔑 ROLE-BASED LANDING */}
      <Route
        path="/"
        element={
          user.role === "admin"
            ? <Navigate to="/admin/places" replace />
            : <Navigate to="/dashboard" replace />
        }
      />

      {/* USER DASHBOARD */}
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin/places"
        element={
          <RequireAdmin user={user}>
            <AdminLayout>
              <PlacesList />
            </AdminLayout>
          </RequireAdmin>
        }
      />

      <Route
        path="/admin/places/add"
        element={
          <RequireAdmin user={user}>
            <AdminLayout>
              <AddPlace />
            </AdminLayout>
          </RequireAdmin>
        }
      />


    </Routes>
  );
}


/* ---------------- ROOT ---------------- */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
