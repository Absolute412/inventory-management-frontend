import { Icon } from "@iconify/react";

export const NotificationDropdown = ({
  notifications = [],
  onMarkAllRead = () => {},
  onMarkRead = () => {},
  onDelete = () => {},
  onDeleteAll = () => {},
}) => {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-3 w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow) sm:left-auto sm:right-0 sm:translate-x-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
        <div>
          <h2 className="text-sm font-bold">Notifications</h2>
          <p className="mt-0.5 text-xs text-(--text-muted)">
            Stay updated with recent activity
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="cursor-pointer text-xs font-semibold text-(--accent) transition hover:text-(--accent-strong)"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onDeleteAll}
              className="cursor-pointer text-xs font-semibold text-(--text-muted) transition hover:text-(--text)"
            >
              Delete all
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
            <Icon icon="mingcute:notification-line" className="text-2xl" />
          </div>

          <h3 className="mt-3 text-sm font-semibold">No notifications</h3>

          <p className="mt-1 text-xs text-(--text-muted)">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="max-h-70 overflow-y-auto custom-scrollbar">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => onMarkRead(notification.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onMarkRead(notification.id);
                }
              }}
              role="button"
              tabIndex={0}
              className={`flex w-full gap-3 border-b border-(--border) px-4 py-3 text-left transition hover:bg-(--surface-muted) ${
                !notification.read ? "bg-(--accent)/5" : ""
              }`}
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                <Icon
                  icon={notification.icon || "mingcute:notification-line"}
                  className="text-lg"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{notification.title}</p>

                  <div className="flex shrink-0 items-center gap-2">
                    {!notification.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-(--accent)" />
                    )}
                    <button
                      type="button"
                      aria-label="Delete notification"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-(--text-muted) transition hover:bg-(--surface-elevated) hover:text-(--text)"
                    >
                      <Icon
                        icon="mingcute:delete-2-line"
                        className="text-base"
                      />
                    </button>
                  </div>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-(--text-muted)">
                  {notification.message}
                </p>

                <p className="mt-2 text-[11px] text-(--text-muted)">
                  {new Date(notification.createdAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
