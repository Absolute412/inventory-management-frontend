import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import { useInventory } from "../../hooks/useInventory";
import { BRANCH_TYPE_CONFIG } from "../configs/branchConfig";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const formatNumber = (value) => new Intl.NumberFormat("en").format(value);

export const useManagerDashboard = () => {
  const { user } = useAuth();
  const { inventory } = useInventory();
  const [reports, setReports] = useState([]);
  const [reportItems, setReportItems] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const branchName = user?.branch?.name || "Your branch";
  const managerName = user?.name || "Manager";
  const branchType = user?.branch?.branchType || "WATER";
  const branchConfig = BRANCH_TYPE_CONFIG[branchType] || BRANCH_TYPE_CONFIG.WATER;
  const showBranchPills = branchType === "BUILDING_MATERIALS";

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [reportsRes, reportItemsRes, complaintsRes] = await Promise.all([
          axios.get("/reports"),
          axios.get("/report-items"),
          axios.get("/complaints"),
        ]);

        setReports(reportsRes.data || []);
        setReportItems(reportItemsRes.data || []);
        setComplaints(complaintsRes.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const today = new Date().toISOString().slice(0, 10);

  const assignedBranchId = user?.branch?.id;

  const assignedBranchReports = useMemo(() => {
    return reports.filter((report) => report.branchId === assignedBranchId);
  }, [reports, assignedBranchId]);

  const assignedBranchComplaints = useMemo(() => {
    return complaints.filter((c) => c.branchId === assignedBranchId);
  }, [complaints, assignedBranchId]);

  const assignedBranchSortedReports = useMemo(() => {
    return [...assignedBranchReports].sort((a, b) =>
      new Date(b.reportDate) - new Date(a.reportDate)
    );
  }, [assignedBranchReports]);

  const sortedReports = useMemo(() => 
    [...reports]
      .sort((a, b) => 
        new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
      ).map((report) => ({
        ...report,
        submittedByLabel:
          report.user?.name ||
          report.submittedBy ||
          "Unknown",
      })), [reports]
  );

  const latestReport = assignedBranchSortedReports[0] ?? null;

  const todaysReportsCount = assignedBranchReports.filter(
    (report) => report.reportDate.slice(0, 10) === today,
  ).length;

  const reportItemsByReport = useMemo(() => {
    const map = new Map();

    reportItems.forEach((item) => {
      const reportList = map.get(item.reportId) || [];
      reportList.push(item);
      map.set(item.reportId, reportList);
    });

    return map;
  }, [reportItems]);

  const getReportMetrics = useCallback((report) => {
    const items = reportItemsByReport.get(report?.id) || [];

    if (branchType === "WATER") {
      return {
        primary: report?.sachetProduced ?? 0,
        secondary: report?.bottledProduced ?? 0,
      };
    }

    const primary = items.reduce((total, item) => total + (item.openingStock ?? 0), 0);
    const secondary = items.reduce((total, item) => total + (item.soldOrUsed ?? 0), 0);

    return { primary, secondary };
  }, [branchType, reportItemsByReport]);

  const latestReportMetrics = getReportMetrics(latestReport);

  const trendData = useMemo(() =>
    sortedReports.slice(0, 6).map((report) => ({
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        new Date(report.reportDate),
      ),
      ...getReportMetrics(report),
    })),

    [sortedReports, getReportMetrics]
  );

  const maxTrendPrimary = Math.max(...trendData.map((item) => item.primary), 1);
  const maxTrendSecondary = Math.max(...trendData.map((item) => item.secondary), 1);

  const inventorySnapshot = useMemo(() => {
    return (inventory || []).map((item) => ({
      id: item.id,
      name: item.name,
      branchId: item.branchId,
      branchName: item.branch?.name || "Unknown branch",
      unit: item.unit,
      category: item.category,
      openingStock: Number(item.openingStock ?? 0),
      stockAdded: Number(item.stockAdded ?? 0),
      soldOrUsed: Number(item.soldOrUsed ?? 0),
      remainingStock: Number(item.remainingStock ?? 0),
    }));
  }, [inventory]);

  const visibleItems = inventorySnapshot.slice(0, 2);

  const unresolvedComplaints = complaints.filter((c) => c.status === "UNRESOLVED");

  const stats = [
    {
      label: "Today's Reports",
      value: `${todaysReportsCount}/1`,
      note: `${todaysReportsCount} submitted today`,
      icon: "iconoir:reports",
      tone: "from-sky-500 to-cyan-400",
    },
    {
      label: branchConfig.statLabels.primary,
      value:
        latestReport && latestReportMetrics.primary != null
          ? formatNumber(latestReportMetrics.primary)
          : "0",
      note: `Latest ${branchConfig.label.toLowerCase()} total`,
      icon: branchConfig.statIcons.primary,
      tone: "from-emerald-500 to-teal-400",
    },
    {
      label: branchConfig.statLabels.secondary,
      value:
        latestReport && latestReportMetrics.secondary != null
          ? formatNumber(latestReportMetrics.secondary)
          : "0",
      note: "Latest branch total",
      icon: branchConfig.statIcons.secondary,
      tone: "from-amber-500 to-orange-400",
    },
    {
      label: "Open Complaints",
      value: formatNumber(assignedBranchComplaints.length),
      note: "Needs your attention",
      icon: "mdi:comment-alert-outline",
      tone: "from-rose-500 to-red-400",
    },
  ];

  return {
    user,
    branchName,
    managerName,
    branchConfig,
    showBranchPills,
    assignedBranchSortedReports,
    assignedBranchReports,
    assignedBranchComplaints,
    sortedReports,
    latestReport,
    latestReportMetrics,
    trendData,
    maxTrendPrimary,
    maxTrendSecondary,
    inventorySnapshot,
    visibleItems,
    stats,
    unresolvedComplaints,
    loading,
    error,
    getReportMetrics,
    formatDate,
    formatNumber,
  };
};
