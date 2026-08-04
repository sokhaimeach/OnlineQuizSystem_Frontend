import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/contexts/auth-session";

export function StudentRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isInitializing, role } = useSession();
  const from = `${location.pathname}${location.search}`;

  if (isInitializing) return null;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from }} replace />;
  if (role !== "STUDENT")
    return (
      <Navigate
        to={role === "TEACHER" ? "/teacher/dashboard" : "/login"}
        replace
      />
    );
  return children;
}
