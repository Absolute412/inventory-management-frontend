const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-(--surface-elevated) ${className}`} />
);

const SkeletonCard = ({ className = "", children }) => (
  <article
    className={`rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow) ${className}`}
  >
    {children}
  </article>
);

export const DashboardSkeleton = ({
  statCount = 4,
  showBranchOverview = false,
}) => {
  const isAdminStats = statCount === 5;

  return (
    <div className="space-y-6">
      <section className="hero-section">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-2xl">
            <Skeleton className="mb-4 h-7 w-28 rounded-full" />

            <Skeleton className="h-10 w-3/4 md:h-14" />

            <Skeleton className="mt-4 h-5 w-full max-w-xl" />
            <Skeleton className="mt-2 h-5 w-2/3 max-w-xl" />
          </div>

          <div className="w-full rounded-(--radius) border border-(--border) bg-(--surface)/80 p-5 backdrop-blur lg:w-72">
            <Skeleton className="h-4 w-24" />

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`grid grid-cols-1 gap-4 ${
          isAdminStats ? "sm:grid-cols-2 xl:grid-cols-6" : "sm:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        {Array.from({ length: statCount }).map((_, index) => (
          <SkeletonCard
            key={index}
            className={isAdminStats && index < 2 ? "sm:col-span-3" : "sm:col-span-1"}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-9 w-20" />
              </div>

              <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
            </div>

            <Skeleton className="mt-5 h-3 w-32" />
          </SkeletonCard>
        ))}
      </section>

      {showBranchOverview && (
        <SkeletonCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-2 h-6 w-44" />
            </div>

            <Skeleton className="h-9 w-24 rounded-full" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl border border-(--border) bg-(--surface) p-5"
              >
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-(--accent)/10 blur-2xl" />

                <div className="relative flex items-start gap-3">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />

                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-2 h-4 w-24 rounded-full" />
                  </div>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-(--border) bg-(--surface-muted) p-3">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="mt-3 h-7 w-10" />
                  </div>

                  <div className="rounded-2xl border border-(--border) bg-(--surface-muted) p-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-3 h-7 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>
      )}

      <SkeletonCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-6 w-48" />
          </div>

          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-(--border) bg-(--surface) p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-full">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>

                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <Skeleton className="mt-4 h-2 w-full rounded-full" />

              <div className="mt-3 flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>

      <SkeletonCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-6 w-44" />
          </div>

          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>

        <div className="mt-6 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-(--border) bg-(--surface) p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="w-full">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="mt-2 h-4 w-full max-w-lg" />
                  <Skeleton className="mt-2 h-4 w-3/4 max-w-md" />
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <Skeleton className="mt-4 h-3 w-28" />
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
};
