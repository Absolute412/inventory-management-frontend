import { createContext, useCallback, useEffect, useMemo, useState, } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../api/axiosInstance";

const ReportsContext = createContext(null);

export const ReportsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState("");

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

  const fetchReports = useCallback(async () => {
    if (!isAuthenticated) {
      setReports([]);
      setReportsError("");
      return;
    }

    setLoadingReports(true);
    setReportsError("");

    try {
      const res = await axios.get("/reports");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const message = normalizeError(err, "Failed to fetch reports");
      setReportsError(message);
    } finally {
      setLoadingReports(false);
    }
  }, [isAuthenticated, normalizeError]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetchReports();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, fetchReports]);

  const addReport = useCallback(
    async (payload) => {
      try {
        const res = await axios.post("/reports", payload);
        const created = res.data;
        setReports((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message = normalizeError(err, "Failed to add report");
        throw new Error(message, { cause: err });
      }
    },
    [normalizeError],
  );

  const updateReport = useCallback(
    async (id, payload) => {
      try {
        const res = await axios.patch(`/reports/${id}`, payload);
        const updated = res.data;

        setReports((prev) =>
          prev.map((report) => (report?.id === id ? updated : report)),
        );

        return updated;
      } catch (err) {
        const message = normalizeError(err, "Failed to update report");
        throw new Error(message, { cause: err });
      }
    },
    [normalizeError],
  );

  const deleteReport = useCallback(
    async (id) => {
      try {
        await axios.delete(`/reports/${id}`);
        setReports((prev) => prev.filter((item) => item?.id !== id));
        return { id };
      } catch (err) {
        const message = normalizeError(err, "Failed to delete reports");
        throw new Error(message, { cause: err });
      }
    },
    [normalizeError],
  );

  const value = useMemo(() => ({
    reports,
    loadingReports,
    reportsError,
    fetchReports,
    addReport,
    updateReport,
    deleteReport,
  }),
  [
    reports,
    loadingReports,
    reportsError,
    fetchReports,
    addReport,
    updateReport,
    deleteReport,
  ]);

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export { ReportsContext };
