export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const base64 = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function getDashboardPath(role) {
  const dashboardByRole = {
    HR: "/hr",
    MANAGER: "/manager",
    EMPLOYEE: "/employee",
  };

  return dashboardByRole[role] || null;
}
