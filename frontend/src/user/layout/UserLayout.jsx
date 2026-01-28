import UserSidebar from "./UserSidebar";
import UserNavbar from "../components/UserNavbar";
import "./user.css";

export default function UserLayout({ children }) {
  return (
    <>
      <UserNavbar />

      <div className="user-layout">
        <UserSidebar />

        <main className="user-main">
          <div className="user-content">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
