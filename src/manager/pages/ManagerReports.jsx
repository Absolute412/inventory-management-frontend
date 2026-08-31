import { useMemo, useState } from "react";
import { useReports } from "../../hooks/useReports";
import { toast } from "sonner";
import { ReportOverview } from "../components/ReportOverview";
import { ReportList } from "../components/ReportList";
import { AddReport } from "../components/AddReport";
import { useAuth } from "../../hooks/useAuth";
import { useBranches } from "../../hooks/useBranches";
import { useManagerDashboard } from "../hooks/useManagerDashboard";
import { Selects } from "../components/Selects";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const ManagerReports = () => {
  const { user } = useAuth();
  const { formatDate } = useManagerDashboard();
  const { accessibleBranches } = useBranches();
  const { reports, deleteReport, loadingReports, reportsError } = useReports();

  const [isOpen, setIsOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const saved = localStorage.getItem("selectedReportBranch");

    return saved ? JSON.parse(saved) : null;
  });

  const selectedBranchForView = useMemo(() => {
    if (accessibleBranches.length === 0) return null;

    const exists = accessibleBranches.find((branch) => branch.id === selectedBranch?.id);
      
    return exists ?? accessibleBranches[0];
  }, [accessibleBranches, selectedBranch]);

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem("selectedReportBranch", JSON.stringify(branch));
  };

  const visibleReports = useMemo(() => {
    if (user.branch.branchType === "BUILDING_MATERIALS") {
      if (!selectedBranchForView) return [];

      return reports.filter((report) => report.branchId === selectedBranchForView.id);
    }

    return reports;
  }, [reports, selectedBranchForView, user]);

  const handleAdd = () => {
    setEditingReport(null);
    setIsOpen(true);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setIsOpen(true);
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReport(reportToDelete.id);
      toast.success("Report deleted");
      setReportToDelete(null);
    } catch (err) {
      toast.error(err.message || "Could not delete report");
    }
  };

  const totalReports = visibleReports.length;

  if (loadingReports) return <p>Loading reports...</p>;
  if (reportsError) return <p>{reportsError}</p>;

  return (
    <>
      {user.branch.branchType === "BUILDING_MATERIALS" && (
        <div className="mb-6 max-w-sm">
          <label className="mb-4 block text-sm font-medium">Select Branch</label>

          <Selects 
            items={accessibleBranches}
            value={selectedBranchForView}
            onChange={handleBranchChange}
          />
        </div>
      )}

      <div className="space-y-6">
        {user.branch.branchType === "BUILDING_MATERIALS" && (
          <h2 className="text-xl font-bold">
            Branch:{" "}
            <span className="text-2xl text-(--accent)">
              {
                user.branch.branchType === "BUILDING_MATERIALS"
                  ? selectedBranchForView?.name
                  : user.branch.name
              }
            </span>
          </h2>
        )}

        {/* Overview */}
        <ReportOverview totalReports={totalReports} onAddClick={handleAdd} />

        {/* ReportList */}
        <ReportList
          reportItems={visibleReports}
          formatDate={formatDate}
          onAddClick={handleAdd}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />
      </div>

      {/* Add modal */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          >
            <div
              className="pointer-events-auto flex items-center justify-center w-full max-w-2xl"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <AddReport
                editingReport={editingReport}
                selectedBranch={selectedBranchForView}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>
        )}

        {reportToDelete && (
          <div
              onClick={() => setReportToDelete(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          >
              <div
                  className="pointer-events-auto w-full max-w-sm"
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
              >
                  <ConfirmationModal
                      title="Delete Report"
                      message="Are you sure you want to delete this report? This action cannot be undone."
                      confirmText="Delete"
                      cancelText="Cancel"
                      variant="danger"
                      onCancel={() => setReportToDelete(null)}
                      onConfirm={handleDeleteConfirm}
                  />
              </div>
          </div>
        )}
    </>
  );
};
