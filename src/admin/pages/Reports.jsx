import { useMemo, useState } from "react";
import { useBranches } from "../../hooks/useBranches";
import { useReports } from "../../hooks/useReports";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { toast } from "sonner";
import { Selects } from "../../manager/components/Selects";
import { ReportOverview } from "../../manager/components/ReportOverview";
import { ReportList } from "../../manager/components/ReportList";
import { AddReport } from "../../manager/components/AddReport";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const Reports = () => {
    const { branches } = useBranches();
    const { reports, deleteReport } = useReports();
    const { formatDate } = useAdminDashboard();

    const [isOpen, setIsOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(() => {
        const saved = localStorage.getItem("selectedAdminReportBranch");

        return saved ? JSON.parse(saved) : null;
    });

    const selectedBranchForView = useMemo(() => {
        if (branches.length === 0) return null;

        const exists = branches.find((branch) => branch.id === selectedBranch?.id);

        return exists ?? branches[0];
    }, [branches, selectedBranch]);

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        localStorage.setItem("selectedAdminReportBranch", JSON.stringify(branch));
    };

    const visibleReports = useMemo(() => {
        if (!selectedBranchForView) return [];

        return reports.filter((report) => report.branchId === selectedBranchForView.id);
    }, [reports, selectedBranchForView]);

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
        if (!reportToDelete) return;

        try {
            await deleteReport(reportToDelete.id);
            toast.success("Report deleted");
            setReportToDelete(null);
        } catch (err) {
            toast.error(err.message || "Could not delete report");
        }
    };
    
    const totalReports = visibleReports.length;

    return (
        <>
            <div className="mb-6 max-w-sm">
                <label className="mb-4 block text-sm font-medium">Select Branch</label>

                <Selects
                    items={branches}
                    value={selectedBranchForView}
                    onChange={handleBranchChange}
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold">
                    Branch:{" "}
                    <span className="text-2xl text-(--accent)">
                        {selectedBranchForView?.name}
                    </span>
                </h2>

                <ReportOverview totalReports={totalReports} onAddClick={handleAdd} />

                <ReportList
                    reportItems={visibleReports}
                    formatDate={formatDate}
                    onAddClick={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </div>

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