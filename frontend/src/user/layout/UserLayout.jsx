import UserSidebar from "./UserSidebar";
import "./user.css";

export default function UserLayout({ children }) {
  return (
    <div className="user-layout">
      <UserSidebar />
      <main className="user-main">
        {children}
      </main>
    </div>
  );
}
