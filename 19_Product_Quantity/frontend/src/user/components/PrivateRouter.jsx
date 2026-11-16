import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () =>
  !!localStorage.getItem("access_token");

const isAdmin = () =>
  localStorage.getItem("is_staff") === "true";

export default function PrivateRouter({
  redirectTo = "/login",
  adminOnly = false,
}) {
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}