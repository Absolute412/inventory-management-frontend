import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { Dropdown } from "./Dropdown";
import { useAuth } from "../../hooks/useAuth";

const complaintFilters = [
    {
        label: "All Complaints",
        value: "ALL",
    },
    {
        label: "Unresolved",
        value: "UNRESOLVED",
    },
    {
        label: "Resolved",
        value: "RESOLVED",
    },
];

const options = complaintFilters.map((filter) => filter.label);

export const ComplaintList = ({
    formatDate,
    complaintItems = [],
    onAddClick = () => {},
    onEdit = () => {},
    onResolve = () => {},
    onReopen = () => {},
    onDelete = () => {},
}) => {
    const { user } = useAuth();
    const [selectedComplaint, setSelectedComplaint] = useState("All Complaints");

    const normalizedComplaints = useMemo(() => {
        const items = complaintItems ?? [];
        return items.map((complaint) => ({
            id: complaint.id,
            title: complaint.title,
            description: complaint.description,
            createdAt: complaint.createdAt,
            status: complaint.status,
            resolvedAt: complaint.resolvedAt,
            resolvedBy: complaint.resolvedBy,
        }));
    }, [complaintItems]);

    const filteredComplaints = useMemo(() => {
        const selectedFilter = complaintFilters.find((filter) => filter.label === selectedComplaint);

        if (!selectedFilter || selectedFilter.value === "ALL") {
            return normalizedComplaints;
        }

        return normalizedComplaints.filter((complaint) => complaint.status === selectedFilter.value);
    }, [normalizedComplaints, selectedComplaint]);

    return (
        <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--text-muted)">Complaint list</p>
                    <h3 className="text-xl font-bold">Recent complaints</h3>
                </div>

                <Dropdown
                    icon="material-symbols:category"
                    filter={selectedComplaint}
                    options={options}
                    onSelect={setSelectedComplaint}
                />
            </div>

            {normalizedComplaints.length === 0 ? (
                <div className="mt-6 rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                        <Icon icon="mdi:report-line" className="text-3xl" />
                    </div>
        
                    <h3 className="mt-4 text-lg font-semibold">No complaints yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
                        This branch does not have any complaints recorded yet. Add your first
                        complaint.
                    </p>
        
                    <button
                        onClick={onAddClick}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                    >
                        <Icon icon="material-symbols:add" className="text-lg" />
                        Add your first complaint
                    </button>
                </div>
            ) : (
                <div className="mt-6 flex flex-col gap-4">
                    {filteredComplaints.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-(--border) bg-(--surface) p-8 text-center">
                            <p className="text-sm text-(--text-muted)">
                                No complaints match this filter.
                            </p>
                        </div>
                    ) : (
                        filteredComplaints.map((complaint) => (
                            <article
                                key={complaint.id}
                                className="flex flex-col gap-3 rounded-xl border border-(--border)  bg-(--surface) p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="truncate text-base font-semibold">
                                            {complaint.title}
                                        </h3>

                                        <span
                                            className={
                                                complaint.status === "RESOLVED"
                                                    ? "px-2 py-1 rounded-(--radius) text-xs font-medium bg-(--success)/10 text-(--success)"
                                                    : "px-2 py-1 rounded-(--radius) text-xs font-medium bg-(--danger)/10 text-(--danger)"
                                            }
                                        >
                                            {complaint.status === "RESOLVED"
                                                ? "Resolved"
                                                : "Unresolved"}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm text-(--text-muted) line-clamp-2">
                                        {complaint.description}
                                    </p>

                                    <div className="mt-2 flex items-center gap-1 text-xs text-(--text-muted)">
                                        <Icon
                                            icon="material-symbols:calendar-month-outline-rounded"
                                            className="text-base"
                                        />
                                        <span>{formatDate(complaint.createdAt)}</span>
                                    </div>

                                    {complaint.status === "RESOLVED" && (
                                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-(--text-muted)">
                                            <span>
                                                Resolved by{" "}
                                                <span className="font-medium">
                                                    {complaint.resolvedBy?.name || "Unknown"}
                                                </span>
                                            </span>

                                            <span className="text-(--text)">•</span>

                                            <span>{formatDate(complaint.resolvedAt)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {user.role === "ADMIN" && (
                                        complaint.status === "RESOLVED" ? (
                                        <button
                                            onClick={() => onReopen(complaint)}
                                            className="rounded-lg border border-(--border) px-3 py-2 text-sm font-medium hover:bg-(--surface-muted) cursor-pointer"
                                        >
                                            Reopen
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onResolve(complaint)}
                                            className="rounded-lg border border-(--border) px-3 py-2 text-sm font-medium hover:bg-(--surface-muted) cursor-pointer"
                                        >
                                            Resolve
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => onEdit(complaint)}
                                        className="rounded-lg border border-(--border) px-3 py-2 text-sm font-medium hover:bg-(--surface-muted) cursor-pointer"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(complaint)}
                                        className="rounded-lg bg-rose-500 hover:bg-rose-600 px-3 py-2 text-sm font-medium text-white cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            )}
        </section>
    );
};
