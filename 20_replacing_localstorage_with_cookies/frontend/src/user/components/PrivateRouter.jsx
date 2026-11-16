
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";

const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

export default function PrivateRouter({
  redirectTo = "/login",
  adminOnly = false,
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await authFetch(`${BASE}/api/me/`);

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminOnly && !user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
