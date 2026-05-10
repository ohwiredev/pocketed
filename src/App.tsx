import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { useAuth } from "./hooks/useAuth";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import CollectionsPage from "./pages/CollectionsPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import SavePage from "./pages/SavePage";
import SignupPage from "./pages/SignupPage";
import VideoDetailPage from "./pages/VideoDetailPage";

const ProtectedRoute = () => {
  const { session, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/save" element={<SavePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/video/:id" element={<VideoDetailPage />} />
            <Route path="/collection/:id" element={<CollectionDetailPage />} />
          </Route>

          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
