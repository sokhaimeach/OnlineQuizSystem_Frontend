import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "@/utils/tokenStorage";
import { getRoleFromToken, getStoredRole } from "@/utils/authRole";

export function StudentRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const token = getAccessToken();
  const role = getStoredRole() ?? getRoleFromToken(token);
  if (!token)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role !== "STUDENT")
    return (
      <Navigate
        to={role === "TEACHER" ? "/teacher/dashboard" : "/login"}
        replace
      />
    );
  return children;
}
