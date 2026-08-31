import { Icon } from "@iconify/react";

export const StatsGrid = ({ stats }) => (
  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => (
      <article
        key={stat.label}
        className="group rounded-(--radius) border border-(--border) bg-(--surface-muted) p-4 shadow-(--shadow) transition duration-300 hover:-translate-y-1 hover:bg-(--surface)"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-(--text-muted)">{stat.label}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">{stat.value}</h2>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${stat.tone} text-white shadow-lg shadow-black/10`}
          >
            <Icon icon={stat.icon} className="text-2xl" />
          </div>
        </div>
        <p className="mt-5 text-xs font-semibold text-(--text-muted)">{stat.note}</p>
      </article>
    ))}
  </section>
);
