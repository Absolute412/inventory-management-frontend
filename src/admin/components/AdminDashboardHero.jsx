export const AdminDashboardHero = ({ date, greeting }) => (
    <section className="hero-section">
        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-(--accent-soft) blur-3xl" />
        <div className="absolute -bottom-6 right-16 h-16 w-16 rounded-full bg-(--success)/20 blur-2xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface)/80 px-3 py-1 text-xs font-semibold text-(--accent-strong) backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-(--success)" />
                    Admin overview
                </div>

                <p className="text-sm font-medium text-(--text-muted)">{date}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-(--text) sm:text-3xl">
                    {greeting}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-(--text-muted) sm:text-base">
                    Here's the latest pulse across branches, users, reports, inventory, and complaints.
                </p>
            </div>
        </div>
    </section>
);
