import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

function Home() {
  const { user, logout } = useAuth();

  if (!user) return <Login />;

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
      <Signup />
    </AuthProvider>
  );
}
