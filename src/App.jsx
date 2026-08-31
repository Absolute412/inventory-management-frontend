import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicRoute } from './components/PublicRoute';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { NotFound } from './pages/NotFound';
import { RoleRoute } from './components/RoleRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { ManagerDashboard } from './manager/pages/ManagerDashboard';
import { ManagerLayout } from './layouts/ManagerLayout';
import { Inventory } from './admin/pages/Inventory';
import { Branches } from './admin/pages/Branches';
import { Users } from './admin/pages/Users';
import { Reports } from './admin/pages/Reports';
import { Complaints } from './admin/pages/Complaints';
import { ManagerInventory } from './manager/pages/ManagerInventory';
import { ManagerReports } from './manager/pages/ManagerReports';
import { ManagerComplaints } from './manager/pages/ManagerComplaints';
import { Toaster } from "sonner";
import { Settings } from './pages/Settings';
import { SettingsLayout } from './layouts/SettingsLayout';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "/login", element: <Login/> },
      { path: "/signup", element: <Signup/> },
    ]
  },
  {
    element: (
      <RoleRoute allowedRoutes={["ADMIN"]}>
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/inventory", element: <Inventory /> },
      { path: "/branches", element: <Branches /> },
      { path: "/users", element: <Users /> },
      { path: "/reports", element: <Reports /> },
      { path: "/complaints", element: <Complaints /> },
    ]
  },
  {
    element: (
      <RoleRoute allowedRoutes={["MANAGER"]}>
        <ManagerLayout />
      </RoleRoute>
    ),
    children: [
      { path: "/manager", element: <ManagerDashboard /> },
      { path: "m-inventory", element: <ManagerInventory /> },
      { path: "m-reports", element: <ManagerReports /> },
      { path: "m-complaints", element: <ManagerComplaints /> },
    ]
  },
  {
    element: (
      <RoleRoute allowedRoutes={["ADMIN", "MANAGER"]}>
        <SettingsLayout />
      </RoleRoute>
    ),
    children: [
      { path: "/settings", element: <Settings /> },
    ]
  },
  { path: "*", element: <NotFound /> }
]) ;

export function App() {
  return (
    <>
      <Toaster richColors position='bottom-right' closeButton />
      <RouterProvider router={router} />
    </>
  );
}
