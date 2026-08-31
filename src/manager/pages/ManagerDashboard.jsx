import { DashboardHero } from "../components/DashboardHero";
import { StatsGrid } from "../components/StatsGrid";
import { InventorySnapshot } from "../components/InventorySnapshot";
import { RecentReports } from "../components/RecentReports";
import { ComplaintDesk } from "../components/ComplaintDesk";
import { useManagerDashboard } from "../hooks/useManagerDashboard";
import { DashboardSkeleton } from "../../components/DashboardSkeleton";

export const ManagerDashboard = () => {
  const {
    branchName,
    managerName,
    branchConfig,
    showBranchPills,
    sortedReports,
    latestReport,
    visibleItems,
    stats,
    unresolvedComplaints,
    loading,
    error,
    getReportMetrics,
    formatDate,
    formatNumber,
  } = useManagerDashboard();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div>Unable to load dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      <DashboardHero
        latestReport={latestReport}
        branchName={branchName}
        branchConfig={branchConfig}
        managerName={managerName}
        formatDate={formatDate}
      />

      <StatsGrid stats={stats} />

      <InventorySnapshot
        visibleItems={visibleItems}
        formatNumber={formatNumber}
        showBranchPills={showBranchPills}
      />

      <RecentReports
        sortedReports={sortedReports}
        getReportMetrics={getReportMetrics}
        branchConfig={branchConfig}
        formatDate={formatDate}
        formatNumber={formatNumber}
        managerName={managerName}
        showBranchPills={showBranchPills}
        path="/m-reports"
      />
      
      <ComplaintDesk
        unresolvedComplaints={unresolvedComplaints}
        formatDate={formatDate}
        showBranchPills={showBranchPills}
      />
    </div>
  );
};
