import { createContext, useEffect, useState } from "react";
import API from "../api/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Run once on app load (check existing token)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ LOGIN FUNCTION (THIS WAS MISSING)
  const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.access_token);

  const me = await API.get("/auth/me");
  setUser(me.data);

  return me.data; // 🔑 IMPORTANT
};


  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
