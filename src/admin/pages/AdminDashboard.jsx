import { DashboardSkeleton } from "../../components/DashboardSkeleton";
import { ComplaintDesk } from "../../manager/components/ComplaintDesk";
import { InventorySnapshot } from "../../manager/components/InventorySnapshot";
import { RecentReports } from "../../manager/components/RecentReports";
import { AdminDashboardHero } from "../components/AdminDashboardHero";
import { AdminStatGrid } from "../components/AdminStatGrid";
import { DashboardBranchOverview } from "../components/DashboardBranchOverview";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export const AdminDashboard = () => {
  const { 
    loading,
    formatDate,
    formatNumber,
    formattedDate, 
    greeting, 
    stats,
    managerName,
    branchConfig,
    branchOverview,
    visibleItems,
    showBranchPills,
    sortedReports,
    getReportMetrics,
    unresolvedComplaints,
  } = useAdminDashboard();

  if (loading) {
    return <DashboardSkeleton statCount={5} showBranchOverview />
  }
  
  return (
    <div className="space-y-6">
      <AdminDashboardHero date={formattedDate} greeting={greeting} />

      <AdminStatGrid stats={stats} />

      <DashboardBranchOverview branchOverview={branchOverview} />

      <InventorySnapshot
        formatNumber={formatNumber}
        visibleItems={visibleItems}
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
        path="/reports"
      />

      <ComplaintDesk 
          unresolvedComplaints={unresolvedComplaints}
          formatDate={formatDate}
          showBranchPills={showBranchPills}
      />
    </div>
  );
}
