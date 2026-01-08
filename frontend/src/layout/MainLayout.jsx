import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div style={{ height: "100vh" }}>
      <Navbar />

      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
