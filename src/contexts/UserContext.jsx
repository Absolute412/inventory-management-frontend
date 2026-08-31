import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../lib/axiosInstance";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");

    const normalizeError = useCallback((err, fallback) => {
        const detail = err?.response?.data?.detail;
    
        if (Array.isArray(detail)) {
            const message = detail
            .map((item) => item?.msg || item?.detail || item?.message)
            .filter(Boolean)
            .join(" ");
    
            if (message) return message;
        }
    
        if (detail && typeof detail === "object") {
            return detail.message || fallback;
        }
    
        return detail || err?.message || fallback;
    }, []);

    const fetchUsers = useCallback(async () => {
        if (!isAuthenticated || user?.role !== "ADMIN") {
            setUsers([]);
            setUsersError("");
            return;
        }

        setLoadingUsers(true);
        setUsersError("");

        try {
            const res = await axios.get("/users");
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setUsersError(normalizeError(err, "Failed to fetch users"));
        } finally {
            setLoadingUsers(false);
        }
    }, [isAuthenticated, user?.role, normalizeError]);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "ADMIN") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsers([]);
            setUsersError("");
            return;
        }

        const timeoutId = window.setTimeout(() => {
            fetchUsers();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [isAuthenticated, user?.role, fetchUsers]);

    const addUser = useCallback(async (payload) => {
        setUsersError("");

        try {
            const res = await axios.post("/users", payload);
            const created = res.data;
            setUsers((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = normalizeError(err, "Failed to add user");
            setUsersError(message);
            throw err;
        }
    }, [normalizeError]);

    const updateUser = useCallback(async (id, payload) => {
        setUsersError("");

        try {
            const res = await axios.patch(`/users/${id}`, payload);
            const updated = res.data;
            
            setUsers((prev) => 
                prev.map((user) => (user?.id === id ? updated : user))
            );

            return updated;
        } catch (err) {
            const message = normalizeError(err, "Failed to update user");
            setUsersError(message);
            throw err;
        }
    }, [normalizeError]);

    const deleteUser = useCallback(async (id) => {
        setUsersError("");

        try {
            await axios.delete(`/users/${id}`);
            setUsers((prev) => prev.filter((user) => user?.id !== id));
            return { id };
        } catch (err) {
            const message = err?.response?.data?.message || normalizeError(err, "Failed to delete user");
            setUsersError(message);
            throw new Error(message, { cause: err });
        }
    }, [normalizeError]);

    const value = useMemo(() => ({
        users,
        loadingUsers,
        usersError,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser
    }), [
        users,
        loadingUsers,
        usersError,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser
    ]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext };
