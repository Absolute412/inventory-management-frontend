import { Icon } from "@iconify/react";
import { Dropdown } from "../../manager/components/Dropdown";
import { useMemo, useState } from "react";

const branchTypeLabels = {
    WATER: "Water",
    BUILDING_MATERIALS: "Building Materials",
};

export const BranchCards = ({ 
    branchOverview=[],
    onAddClick = () => {},
    onEdit = () => {},
    onDelete = () => {},
}) => {
    const [selectedBranch, setSelectedBranch] = useState("All Branches");

    const branchFilters = useMemo(() => {
        const uniqueBranchTypes = [
            ...new Set(branchOverview.map((branch) => branch.branchType).filter(Boolean)),
        ];

        return [
            {
                label: "All Branches",
                value: "ALL",
            },
            ...uniqueBranchTypes.map((branchType) => ({
                label: branchTypeLabels[branchType] || branchType,
                value: branchType,
            })),
        ];
    }, [branchOverview]);

    const options = useMemo(
        () => branchFilters.map((filter) => filter.label),
        [branchFilters],
    );

    const filteredBranches = useMemo(() => {
        const selectedFilter = branchFilters.find((filter) => filter.label === selectedBranch);

        if (!selectedFilter || selectedFilter.value === "ALL") {
            return branchOverview;
        }

        return branchOverview.filter((branch) => branch.branchType === selectedFilter.value);
    }, [branchOverview, branchFilters, selectedBranch]);
    
    return (
        <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--text-muted)">Branch list</p>
                    <h3 className="text-xl font-bold">All Branches</h3>
                </div>

                <Dropdown
                    icon="material-symbols:category"
                    filter={selectedBranch}
                    options={options}
                    onSelect={setSelectedBranch}
                />
            </div>

            {branchOverview.length === 0 ? (
                <div className="mt-6 rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                        <Icon icon="mdi:domain" className="text-3xl" />
                    </div>
        
                    <h3 className="mt-4 text-lg font-semibold">No branches yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
                        No branches have been recorded yet. Add your first branch to start managing your business locations.
                    </p>
        
                    <button
                        onClick={onAddClick}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                    >
                        <Icon icon="material-symbols:add" className="text-lg" />
                        Add your first Branch
                    </button>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredBranches.map((branch) => (
                        <div
                            key={branch.id}
                            className="group rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow) hover:-translate-y-1 transition"
                        >
                            <div className="flex items-start gap-3">
                                <div>
                                    <h3 className="text-lg font-bold">{branch.name}</h3>
                                    <span className="mt-2 inline-flex rounded-full bg-(--surface-muted) px-3 py-1 text-xs font-semibold text-(--text-muted)">
                                        {branch.branchType === "WATER" ? "Water" : "Building Materials"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-(--surface-muted) p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Reports</p>
                                    <p className="mt-2 text-2xl font-black">{branch.reportCount}</p>
                                </div>

                                <div className="rounded-2xl bg-(--surface-muted) p-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Complaints</p>
                                    <p className="mt-2 text-2xl font-black">{branch.unresolvedComplaintCount}</p>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button
                                    onClick={() => onEdit(branch)}
                                    className="rounded-xl border border-(--border) px-4 py-2 text-sm font-semibold hover:bg-(--surface-muted) cursor-pointer"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => onDelete(branch)}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
