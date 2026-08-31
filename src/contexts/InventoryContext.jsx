import { createContext, useCallback, useEffect, useMemo, useState, } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState("");

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

  const fetchInventoryItems = useCallback(async () => {
    if (!isAuthenticated) {
      setInventory([]);
      setInventoryError("");
      return;
    }

    setLoadingInventory(true);
    setInventoryError("");

    try {
      const res = await axios.get("/inventory-items");
      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setInventoryError(
        normalizeError(err, "Failed to fetch inventory items."),
      );
    } finally {
      setLoadingInventory(false);
    }
  }, [isAuthenticated, normalizeError]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetchInventoryItems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, fetchInventoryItems]);

  const addInventoryItem = useCallback(
    async (payload) => {
      setInventoryError("");

      try {
        const res = await axios.post("/inventory-items", payload);
        const created = res.data;
        setInventory((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message = normalizeError(err, "Failed to add inventory item");
        setInventoryError(message);
        throw err;
      }
    },
    [normalizeError],
  );

  const updateInventoryItem = useCallback(
    async (id, payload) => {
      setInventoryError("");

      try {
        const res = await axios.patch(`/inventory-items/${id}`, payload);
        const updated = res.data;

        setInventory((prev) =>
          prev.map((item) => (item?.id === id ? updated : item)),
        );

        return updated;
      } catch (err) {
        const message = normalizeError(err, "Failed to update inventory item");
        setInventoryError(message);
        throw err;
      }
    },
    [normalizeError],
  );

  const deleteInventoryItem = useCallback(
    async (id) => {
      setInventoryError("");

      try {
        await axios.delete(`/inventory-items/${id}`);
        setInventory((prev) => prev.filter((item) => item?.id !== id));
        return { id };
      } catch (err) {
        const message = err?.response?.data?.message || normalizeError(err, "Failed to delete inventory item");
        setInventoryError(message);
        throw new Error(message, { cause: err });
      }
    },
    [normalizeError],
  );

  const value = useMemo(() => ({
    inventory,
    loadingInventory,
    inventoryError,
    fetchInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  }), 
  [
    inventory,
    loadingInventory,
    inventoryError,
    fetchInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  ]);

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryContext };
