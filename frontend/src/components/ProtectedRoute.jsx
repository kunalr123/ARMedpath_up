import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap pages that require the user to be logged in.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container section">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
