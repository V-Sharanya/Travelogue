import { Routes, Route } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import PostFeed from "./posts/PostFeed";
import CreatePost from "./posts/CreatePost";

export default function UserDashboard() {
  return (
    <UserLayout>
      <Routes>
        {/* Dashboard = OTHER USERS POSTS */}
        <Route index element={<PostFeed showOthersOnly />} />

        <Route path="create" element={<CreatePost />} />

        {/* placeholders */}
        <Route path="recommendations" element={<div>Coming soon</div>} />
        <Route path="settings" element={<div>Settings</div>} />
      </Routes>
    </UserLayout>
  );
}
