import { useAuth } from "../hooks/useAuth";
import { AdminLayout } from "./AdminLayout";
import { ManagerLayout } from "./ManagerLayout";

export const SettingsLayout = () => {
    const { user } = useAuth();

    if (user?.role === "ADMIN") {
        return <AdminLayout />;
    }

    if (user?.role === "MANAGER") {
        return <ManagerLayout />;
    }

    return null;
};