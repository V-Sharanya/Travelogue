import UserSidebar from "./UserSidebar";
import "./user.css";

export default function UserLayout({ children }) {
  return (
    <div className="user-layout">
      <UserSidebar />
      <main className="user-main">
        <div className="user-content">
          {children}
        </div>
      </main>
    </div>
  );
}

