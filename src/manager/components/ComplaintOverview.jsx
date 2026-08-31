import { Icon } from "@iconify/react";

export const ComplaintOverview = ({ totalComplaints, unresolvedComplaints, resolvedComplaints, onAddClick }) => {
    return (
        <section className="space-y-4 p-6 border border-(--border) rounded-(--radius) bg-(--surface-muted) shadow-(--shadow)">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--accent-strong)">Manager Complaints</p>
                    <h1 className="text-2xl font-bold">Complaint overview</h1>
                    <p className="mt-2 text-sm text-(--text-muted)">Review all complaints priorities.</p>
                </div>

                <button onClick={onAddClick} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)">
                    <Icon icon="material-symbols:add" className="text-lg" />
                    Add Complaint
                </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Total complaints</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {totalComplaints}
                    </h2>
                </article>

                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Unresolved complaints</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {unresolvedComplaints}
                    </h2>
                </article>

                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Resolved complaints</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {resolvedComplaints}
                    </h2>
                </article>
            </div>
        </section>
    );
};