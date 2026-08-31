import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { Icon } from "@iconify/react";
import { ROLE_LABELS } from "../admin/configs/userConfig";
import { NotificationDropdown } from "./NotificationDropdown";

const pageTitle = {
  "/admin": "Main Dashboard",
  "/inventory": "Inventory",
  "/branches": "Branches",
  "/users": "Users",
  "/reports": "Reports",
  "/complaints": "Complaints",

  "/managers": "Main Dashboard",
  "/m-inventory": "Inventory",
  "/m-reports": "Reports",
  "/m-complaints": "Complaints",

  "/settings": "Settings",
};

export const Navbar = ({ setIsOpen }) => {
  const { user } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);

  const toggleTheme = () => setIsDark(!isDark);
  const location = useLocation();
  const currentTitle = pageTitle[location.pathname] || "Dashboard";

  const avatarLabel = useMemo(() => {
    const base = (user?.name || user?.email || "").trim();
    return base ? base.charAt(0).toUpperCase() : "?";
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showNotification) return undefined;

    const handleOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotification]);

  return (
    <header
      className={`
        sticky top-0 z-30 backdrop-blur-xl rounded-(--radius) mb-4 transition-all duration-500 
        ${isScrolled ? "glass-strong" : "bg-transparent"}
    `}
    >
      <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4 mx-auto py-4 md:py-6 h-auto w-full max-w-screen-2xl px-4 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              to={user?.role === "ADMIN" ? "/admin" : "/manager"}
              className="flex h-8 w-8 items-center justify-center rounded-(--radius) bg-(--surface-muted) hover:bg-(--surface-elevated) cursor-pointer"
            >
              <Icon
                icon="material-symbols:home-outline-rounded"
                className="text-lg text-(--accent) "
              />
            </Link>

            <h1 className="text-sm font-medium text-(--text-muted) tracking-wide">
              {currentTitle}
            </h1>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-(--text)">
            {currentTitle}
          </h1>
        </div>

        <div className="w-fit  flex items-center gap-3 rounded-full bg-(--surface) px-3 py-2 shadow-(--shadow)">
          {/* User */}
          <Link to="/settings" className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--surface-elevated) text-sm font-bold">
              {avatarLabel}
            </div>

            <div className="flex min-w-0 flex-col text-left leading-tight">
              <p className="truncate text-sm font-bold">{user.name}</p>

              <p className="text-xs font-medium text-(--text-muted)">
                {ROLE_LABELS[user.role] || user.role}
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1 border-l border-(--border) pl-2">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-muted) 
              transition hover:bg-(--surface-elevated) hover:text-(--text) lg:hidden cursor-pointer"
            >
              <Icon icon="stash:burger-classic-duotone" className="text-lg" />
            </button>

            <div ref={notificationRef} className="relative">
              <button
                type="button"
                aria-label="Open notifications"
                aria-expanded={showNotification}
                onClick={() => setShowNotification((prev) => !prev)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-(--text-muted) transition hover:bg-(--surface-elevated) hover:text-(--text) cursor-pointer"
              >
                <Icon icon="mingcute:notification-line" className="text-lg" />

                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-(--accent)" />
                )}
              </button>

              {showNotification && (
                <NotificationDropdown
                  notifications={notifications}
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={markAllNotificationsRead}
                  onDelete={deleteNotification}
                  onDeleteAll={deleteAllNotifications}
                />
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="
              flex h-8 w-8 items-center justify-center rounded-full
              text-(--text-muted) transition hover:bg-(--surface-elevated) hover:text-(--text) cursor-pointer"
            >
              <Icon
                icon={isDark ? "line-md:sun-rising-loop" : "line-md:moon"}
                className="text-lg"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
