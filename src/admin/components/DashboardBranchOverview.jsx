import { Icon } from "@iconify/react";
import { DashboardCard } from "../../manager/components/DashboardCard";

export const DashboardBranchOverview = ({ branchOverview = [], onAddClick }) => {
    const hasBranches = branchOverview.length > 0;

    return (
        <DashboardCard
            title="Branch Overview"
            subTitle="Total Branches"
            icon="mdi-domain"
            className="overflow-hidden"
        >
            {hasBranches ? (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {branchOverview.map((branch) => (
                        <div
                            key={branch.id}
                            className="
                            group relative overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface) p-5
                            transition duration-300 hover:-translate-y-1 hover:border-(--accent)/30 "
                        >
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-(--accent)/10 blur-2xl transition duration-300 group-hover:bg-(--accent)/15" />

                            <div className="relative flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--accent)/10 text-(--accent) ring-1 ring-inset ring-(--accent)/15">
                                            <Icon icon="mdi-domain" className="text-xl" />
                                        </span>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-bold tracking-tight">
                                                {branch.name}
                                            </h3>

                                            <p className="mt-1 inline-flex rounded-full bg-(--surface-elevated) px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
                                                {branch.branchType === "WATER"
                                                    ? "Water"
                                                    : "Building Materials"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-(--border) bg-(--surface-muted) p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                        Reports
                                    </p>
                                    <p className="mt-2 text-2xl font-black tracking-tight">
                                        {branch.reportCount}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--border) bg-(--surface-muted) p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">
                                        Complaints
                                    </p>
                                    <p className="mt-2 text-2xl font-black tracking-tight">
                                        {branch.unresolvedComplaintCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-5 rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                        <Icon icon="mdi:domain" className="text-3xl" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">No branches yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
                        Add your first branch to start tracking reports, complaints, and branch activity here.
                    </p>

                    {onAddClick && (
                        <button
                            onClick={onAddClick}
                            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                        >
                            <Icon icon="material-symbols:add" className="text-lg" />
                            Add Branch
                        </button>
                    )}
                </div>
            )}
        </DashboardCard>
    );
};
