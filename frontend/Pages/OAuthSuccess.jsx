import { Navigate } from "react-router-dom";
import { decodeJwtPayload, getDashboardPath } from "../utils/auth";

function OAuthSuccess() {
  const token = new URLSearchParams(window.location.search).get("token");
  const payload = decodeJwtPayload(token);
  const dashboardPath = getDashboardPath(payload?.role);

  if (!token || !payload || !dashboardPath) {
    console.error("Google login returned an invalid token or role.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  // Storage is synchronous, so ProtectedRoute can read both values immediately.
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(payload));

  return <Navigate to={dashboardPath} replace />;
}

export default OAuthSuccess;
