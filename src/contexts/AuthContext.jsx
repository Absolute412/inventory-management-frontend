/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] =useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async (accessToken) => {
        const res = await axios.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return res.data;
    };

    // Check localStorage on mount

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        const bootstrapAuth = async () => {
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await fetchCurrentUser(storedToken);
                setToken(storedToken);
                setUser(currentUser);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        bootstrapAuth();
    }, []);

    // Login function
    const login = async (identifier, password) => {
        try {
            const res = await axios.post("/auth/login", {
                email: identifier,
                password,
            });

            const { token } = res.data;

            // Save in state + localStorage
            localStorage.setItem("token", token);

            const currentUser = await fetchCurrentUser(token);

            localStorage.setItem("user", JSON.stringify(currentUser));

            setUser(currentUser);
            setToken(token);
            setIsAuthenticated(true);

            return currentUser;
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            throw err;
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // Signup function
    const signup = async (name, email, password) => {
        try {
            await axios.post("/auth/register", { name, email, password });
        } catch (err) {
            console.error("Signup failed:", err.response?.data || err.message);
            throw err;
        }
    };

    // Update user
    const updateUser = (nextUser) => {
        setUser(nextUser);
        if (nextUser) {
            localStorage.setItem("user", JSON.stringify(nextUser));
        } else {
            localStorage.removeItem("user")
        }
    };

    // inside AuthContext
    const refreshUser = async () => {
        const currentUser = await fetchCurrentUser(token);
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        return currentUser;
    };

    const updateProfile = async ({ name, email }) => {
        const res = await axios.patch("/auth/me/profile", { name, email });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data.user;
    };

    const updatePassword = async ({ currentPassword, newPassword }) => {
        const res = await axios.patch("/auth/me/password", {
            currentPassword,
            newPassword,
        });
        return res.data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                login,
                logout,
                signup,
                updateUser,
                refreshUser,
                updateProfile,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
