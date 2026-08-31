import { useAuth } from "../../hooks/useAuth";
import { useBranches } from "../../hooks/useBranches";
import { useUsers } from "../../hooks/useUsers";
import { useReports } from "../../hooks/useReports";
import { useComplaints } from "../../hooks/useComplaints";
import { useInventory } from "../../hooks/useInventory";
import { useCallback, useMemo } from "react";
import { BRANCH_TYPE_CONFIG } from "../../manager/configs/branchConfig";

const dateStr = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "2-digit",
  month: "short",
});

const formattedDate = dateStr.replace(/^(\w+)\s/, "$1, ");

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getGreeting = (name, date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
};

const formatNumber = (value) => new Intl.NumberFormat("en").format(value);

export const useAdminDashboard = () => {
    const { user } = useAuth();
    const { branches, loadingBranches } = useBranches();
    const { users, loadingUsers } = useUsers();
    const { inventory, loadingInventory } = useInventory();
    const { reports, loadingReports } = useReports();
    const { complaints, loadingComplaints } = useComplaints();

    const loading =
        loadingBranches ||
        loadingUsers ||
        loadingInventory ||
        loadingReports ||
        loadingComplaints;

    const greeting = getGreeting(user?.name || "Admin");

    const unresolvedComplaints = useMemo(() => (
        complaints || []).filter((complaint) => complaint.status !== "RESOLVED"
    ), [complaints]);

    const branchName = user?.branch?.name || "All branches";
    const managerName = user?.name || "Manager";
    const branchType = user?.branch?.branchType || "WATER";
    const branchConfig = BRANCH_TYPE_CONFIG[branchType] || BRANCH_TYPE_CONFIG.WATER;
    const showBranchPills = true;

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

    const visibleItems = useMemo(() => {
        return [...inventorySnapshot]
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);
    }, [inventorySnapshot]);

    const sortedReports = useMemo(() =>
        [...(reports || [])]
        .sort(
            (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
        ).map((report) => ({
            ...report,
            submittedByLabel:
                report.user?.name ||
                report.submittedBy ||
                "Unknown",
        })), [reports],
    );

    const getReportMetrics = useCallback((report) => {
        if (!report) return { primary: 0, secondary: 0 };

        const branchType = report?.branch?.branchType || report?.branchType || "BUILDING_MATERIALS";

        if (branchType === "WATER") {
            return {
                primary: Number(report?.sachetProduced ?? 0),
                secondary: Number(report?.bottledProduced ?? 0),
            };
        }

        const items = Array.isArray(report?.items) ? report.items : [];

        const primary = items.reduce((total, item) => total + Number(item?.openingStock ?? 0), 0);
        const secondary = items.reduce((total, item) => total + Number(item?.soldOrUsed ?? 0), 0);

        return { primary, secondary };
    }, []);

    const branchOverview = useMemo(() => {
        return (branches || []).map((branch) => {
            const branchReports = (reports || []).filter(
                (report) => report.branchId === branch.id
            );

            const branchComplaints = (unresolvedComplaints || []).filter(
                (complaint) => complaint.branchId === branch.id
            );

            return {
                id: branch.id,
                name: branch.name,
                branchType: branch.branchType,
                reportCount: branchReports.length,
                unresolvedComplaintCount: branchComplaints.length,
            };
        });
    }, [branches, reports, unresolvedComplaints]);

    const branchStats = useMemo(() => {
        const totalBranch = branches.length;

        const water = branches.filter((branch) => branch.branchType === "WATER").length;

        const building = branches.filter((branch) => branch.branchType === "BUILDING_MATERIALS").length;

        return {
            totalBranch,
            water,
            building,
        };
    }, [branches]);

    const stats = [
        {
            label: "Total Branches",
            value: branches.length,
            note: "Active branches",
            icon: "mdi:domain",
            tone: "from-sky-500 to-cyan-400",
        },
        {
            label: "Total Users",
            value: users.length,
            note: "Registered users",
            icon: "mdi:users-outline",
            tone: "from-violet-500 to-purple-400",
        },
        {
            label: "Total Inventory Items",
            value: inventory.length,
            note: "Items across all branches",
            icon: "material-symbols:inventory",
            tone: "from-emerald-500 to-teal-400",
        },
        {
            label: "Total Reports",
            value: reports.length,
            note: "Reports submitted",
            icon: "iconoir:reports",
            tone: "from-amber-500 to-orange-400",
        },
        {
            label: "Unresolved Complaints",
            value: unresolvedComplaints.length,
            note: "Needs attention",
            icon: "mdi:comment-alert-outline",
            tone: "from-rose-500 to-red-400",
        },
    ];

    return {
        user,
        stats,
        branches,
        users,
        inventory,
        reports,
        complaints,
        formattedDate,
        greeting,
        branchName,
        totalBranch: branchStats.totalBranch,
        water: branchStats.water,
        building: branchStats.building,
        managerName,
        branchConfig,
        branchOverview,
        showBranchPills,
        visibleItems,
        sortedReports,
        getReportMetrics,
        formatDate,
        formatNumber,
        unresolvedComplaints,
        loading,
    };
};
