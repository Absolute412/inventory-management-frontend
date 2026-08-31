import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../api/axiosInstance";

const BranchContext = createContext(null);

export const BranchProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [branches, setBranches] = useState([]);
    const [accessibleBranches, setAccessibleBranches] = useState([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [branchError, setBranchError] = useState("");

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

    const fetchBranches = useCallback(async () => {
        if (!isAuthenticated) {
            setBranches([]);
            setBranchError("");
            return;
        }

        setLoadingBranches(true);
        setBranchError("");

        try {
            const res = await axios.get("/branches");
            setBranches(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setBranchError(normalizeError(err, "Failed to fetch branches"));
        } finally {
            setLoadingBranches(false);
        }
    }, [isAuthenticated, normalizeError]);

    const fetchAccessibleBranches = useCallback(async () => {
        if (!isAuthenticated) {
            setAccessibleBranches([]);
            setBranchError("");
            return;
        }

        setLoadingBranches(true);
        setBranchError("");

        try {
            const res = await axios.get("/branches/accessible");
            setAccessibleBranches(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setBranchError(normalizeError(err, "Failed to fetch accessible branches"));
        } finally {
            setLoadingBranches(false);
        }
    }, [isAuthenticated, normalizeError]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const timeoutId = window.setTimeout(() => { 
            fetchBranches();
            fetchAccessibleBranches();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [isAuthenticated, fetchBranches, fetchAccessibleBranches]);

    const addBranch = useCallback(async (payload) => {
        setBranchError("");

        try {
            const res = await axios.post("/branches", payload);
            const created = res.data;
            setBranches((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            const message = normalizeError(err, "Failed to add branch");
            setBranchError(message);
            throw err;
        }
    }, [normalizeError]);

    const updateBranch = useCallback(async (id, payload) => {
        setBranchError("");

        try {
            const res = await axios.patch(`/branches/${id}`, payload);
            const updated = res.data;

            setBranches((prev) =>
                prev.map((branch) => (branch?.id === id ? updated : branch))
            );

            return updated;
        } catch (err) {
            const message = normalizeError(err, "Failed to update branch");
            setBranchError(message);
            throw err;
        }
    }, [normalizeError]);

    const deleteBranch = useCallback(async (id) => {
        setBranchError("");

        try {
            await axios.delete(`/branches/${id}`);
            setBranches((prev) => prev.filter((branch) => branch?.id !== id));
            return { id };
        } catch (err) {
            const message = err?.response?.data?.message || normalizeError(err, "Failed to delete branch");
            setBranchError(message);
            throw new Error(message, { cause: err });
        }
    }, [normalizeError]);

    const value = useMemo(() => ({
        branches,
        accessibleBranches,
        loadingBranches,
        branchError,
        fetchBranches,
        fetchAccessibleBranches,
        addBranch,
        updateBranch,
        deleteBranch
    }), 
    [
        branches,
        accessibleBranches,
        loadingBranches,
        branchError,
        fetchBranches,
        fetchAccessibleBranches,
        addBranch,
        updateBranch,
        deleteBranch
    ]);

    return (
        <BranchContext.Provider value={value}>
            {children}
        </BranchContext.Provider>
    );
};

export { BranchContext };