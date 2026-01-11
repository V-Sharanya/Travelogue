import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Places from "./pages/Places"; // ✅ THIS WAS MISSING

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/places" element={<Places />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
