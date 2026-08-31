import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

export const RoleRoute = ({ allowedRoutes, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-3">
                <div className="w-10 h-10 border-4 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-(--text-muted)">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoutes.includes(user.role)) {
        return <Navigate to="/login" replace />
    }
  return children;
};
