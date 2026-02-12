import { Routes, Route } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import PostFeed from "./posts/PostFeed";
import CreatePost from "./posts/CreatePost";
import SavedPosts from "./posts/SavedPosts";
import RecommendationsPage from "./posts/RecommendationsPage";
import TripPlannerPage from "./posts/TripPlannerPage";
import UserProfile from "./posts/UserProfile";
import SettingsPage from "./settings/SettingsPage";

export default function UserDashboard() {
  return (
    <UserLayout>
      <Routes>
        <Route index element={<PostFeed showOthersOnly />} />
        <Route path="create" element={<CreatePost />} />
        <Route path="saved" element={<SavedPosts />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="trip-planner" element={<TripPlannerPage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </UserLayout>
  );
}
