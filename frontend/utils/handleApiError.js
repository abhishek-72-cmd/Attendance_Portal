// Shared API error helper.
// - Detects expired/invalid sessions (401 / 403) and shows an alert
//   then redirects the user to the login page.
// - Returns a friendly message string for any other error so callers
//   can display it inline.
export function handleApiError(err, fallback = "Something went wrong") {
  const status = err?.response?.status;
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;

  // ✅ ONLY logout on 401
  if (status === 401) {
    if (!window.__sessionExpiredShown) {
      window.__sessionExpiredShown = true;

      alert("Your session has expired. Please log in again.");

      try {
        localStorage.clear();
      } catch {}

      setTimeout(() => {
        window.__sessionExpiredShown = false;
      }, 3000);

      window.location.href = "/";
    }

    return "Session expired";
  }

  // ✅ DO NOT logout on 403
  if (status === 403) {
    return msg || "Access denied";
  }

  return msg;
}

// Helper: number of days between two ISO date strings (inclusive).
export function calcLeaveDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  const ms = e.setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? days : 0;
}

// Helper: duration string between two timestamps (HH:MM)
export function calcDuration(checkIn, checkOut) {
  if (!checkIn) return "—";
  if (!checkOut) return "In progress";
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return "—";
  const ms = b - a;
  if (ms < 0) return "—";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
