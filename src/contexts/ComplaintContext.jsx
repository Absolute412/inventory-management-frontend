import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "../lib/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [complaints, setComplaints] = useState([]);
    const [loadingComplaints, setLoadingComplaints] = useState(false);
    const [complaintsError, setComplaintsError] = useState("");

    const normalizeError = useCallback((err, fallback) => {
        const data = err?.response?.data;
        const detail = data?.detail || data?.errors;
    
        if (typeof data?.message === "string") {
          return data.message;
        }
    
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
    
        return data?.message || data?.error || err?.message || fallback;
    }, []);

    const fetchComplaints = useCallback(async () => {
        if (!isAuthenticated) {
            setComplaints([]);
            setComplaintsError("");
            return;
        }

        setLoadingComplaints(true);
        setComplaintsError("");

        try {
            const res = await axios.get("/complaints");
            setComplaints(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            const message = normalizeError(err, "Failed to fetch complaints");
            setComplaintsError(message);
        } finally {
            setLoadingComplaints(false);
        }
    }, [isAuthenticated, normalizeError])

    useEffect(() => {
        if (!isAuthenticated) return;

        const timeoutId = window.setTimeout(() => { 
            fetchComplaints();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [isAuthenticated, fetchComplaints]);

    const addComplaint = useCallback(async(payload) => {
        setComplaintsError("");

        try {
            const res = await axios.post("/complaints", payload);
            const created = res.data;
            setComplaints((prev) => [created, ...prev]);

            return created;
        } catch (err) {
            const message = normalizeError(err, "Failed to add complaint");
            setComplaintsError(message);
            throw err;
        }
    }, [normalizeError]);

    const updateComplaint = useCallback(async(id, payload) => {
        setComplaintsError("");

        try {
            const res = await axios.patch(`/complaints/${id}`, payload);
            const updated = res.data;

            setComplaints((prev) =>
                prev.map((complaint) => (complaint?.id === id ? updated : complaint)),
            );

            return updated;
        } catch (err) {
            const message = normalizeError(err, "Failed to update complaint");
            setComplaintsError(message);
            throw err;
        }
    }, [normalizeError]);

    const resolveComplaint = useCallback(async(id) => {
        setComplaintsError("");

        try {
            const res = await axios.patch(`/complaints/${id}/resolve`);
            const updated = res.data;

            setComplaints((prev) =>
                prev.map((complaint) => (complaint.id === id ? updated : complaint)),
            );

            return updated;
        } catch (err) {
            const message = normalizeError(err, "Failed to resolve complaint");
            setComplaintsError(message);
            throw err;
        }
    }, [normalizeError]);

    const reopenComplaint = useCallback(async(id) => {
        setComplaintsError("");

        try {
            const res = await axios.patch(`/complaints/${id}/reopen`);
            const updated = res.data;

            setComplaints((prev) =>
                prev.map((complaint) => (complaint.id === id ? updated : complaint)),
            );

            return updated;
        } catch (err) {
            const message = normalizeError(err, "Failed to reopen complaint");
            setComplaintsError(message);
            throw err;
        }
    }, [normalizeError]);

    const deleteComplaint = useCallback(async(id) => {
        setComplaintsError("");

        try {
            await axios.delete(`/complaints/${id}`);
            setComplaints((prev) => prev.filter((complaint) => complaint?.id !== id));

            return { id };
        } catch (err) {
            const message = err?.response?.data?.message || normalizeError(err, "Failed to delete complaint");
            setComplaintsError(message);
            throw new Error(message, { cause: err });
        }
    }, [normalizeError]);

    const value = useMemo(() => ({
        complaints,
        loadingComplaints,
        complaintsError,
        fetchComplaints,
        addComplaint,
        updateComplaint,
        resolveComplaint,
        reopenComplaint,
        deleteComplaint,
    }), [
        complaints,
        loadingComplaints,
        complaintsError,
        fetchComplaints,
        addComplaint,
        updateComplaint,
        resolveComplaint,
        reopenComplaint,
        deleteComplaint,
    ])
    
    return (
        <ComplaintContext.Provider value={value}>
            {children}
        </ComplaintContext.Provider>
    );
};

export { ComplaintContext };
