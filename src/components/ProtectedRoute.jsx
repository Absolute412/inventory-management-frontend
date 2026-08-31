import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-3">
                <div className="w-10 h-10 border-4 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-(--text-muted)">Loading your session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
  return children;
}
