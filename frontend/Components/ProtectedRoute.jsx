import { Navigate } from "react-router-dom";
import { decodeJwtPayload } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
  }

  // Recover the user from a valid token if storage was incomplete.
  if (!user?.role) {
    user = decodeJwtPayload(token);

    if (user?.role) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  if (!user?.role) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
