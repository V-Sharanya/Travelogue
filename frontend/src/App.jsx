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
import AdminDashboard from "./admin/AdminDashboard";
import EditPlace from "./admin/Places/EditPlace";
import UserDashboard from "./user/UserDashboard";



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
  {/* ROOT */}
  <Route
    path="/"
    element={
      user.role === "admin"
        ? <Navigate to="/admin" replace />
        : <Navigate to="/dashboard" replace />
    }
  />

  {/* USER */}
  <Route path="/dashboard/*" element={<UserDashboard />} />

  {/* ADMIN (NESTED ROUTES) */}
  <Route
    path="/admin"
    element={
      <RequireAdmin user={user}>
        <AdminLayout />
      </RequireAdmin>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="places" element={<PlacesList />} />
    <Route path="places/add" element={<AddPlace />} />
    <Route path="places/edit/:id" element={<EditPlace />} />
  </Route>
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
