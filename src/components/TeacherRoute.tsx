import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getRoleFromToken, getStoredRole } from "@/utils/authRole";
import { getAccessToken } from "@/utils/tokenStorage";

export function TeacherRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const token = getAccessToken();
  const role = getStoredRole() ?? getRoleFromToken(token);

  if (!token)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role !== "TEACHER")
    return (
      <Navigate
        to={role === "STUDENT" ? "/student/dashboard" : "/login"}
        replace
      />
    );

  return children;
}
