import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import { handleApiError, calcDuration } from "../utils/handleApiError";

export default function Timesheet() {
  const [data, setData] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // id -> name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // ?view=my forces personal timesheet (used by HR/Manager "My Timesheet" link)
  const viewParam = new URLSearchParams(location.search).get("view");
  const forceMyView = viewParam === "my";

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const fetchUserDirectory = async () => {
    try {
      const res = await API.get("/users");
      const list = Array.isArray(res.data) ? res.data : [];
      const map = {};
      list.forEach((u) => {
        map[u.id] = u.name || u.email || `User #${u.id}`;
      });
      setUsersMap(map);
    } catch (err) {
      console.warn("User directory fetch failed", err);
    }
  };

  const fetchData = async () => {
    if (!user) {
      navigate("/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let res;
      if (forceMyView) {
        // HR/Manager explicitly viewing their own attendance
        res = await API.get("/attendance/my");
      } else if (user.role === "HR") {
        res = await API.get("/attendance/org");
      } else if (user.role === "MANAGER") {
        res = await API.get("/attendance/team");
      } else {
        res = await API.get("/attendance/my");
      }
      const responseData = res.data;
      if (Array.isArray(responseData)) {
        setData(responseData);
      } else if (Array.isArray(responseData?.data)) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setError(handleApiError(err, "Failed to load timesheet"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (!forceMyView && (user?.role === "HR" || user?.role === "MANAGER")) {
      fetchUserDirectory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceMyView]);

  const handleCheckIn = async () => {
    setCheckLoading(true);
    try {
      await API.post("/attendance/check-in");
      alert("✓ Checked in successfully");
      await fetchData();
    } catch (err) {
      alert(handleApiError(err, "Check-in failed"));
    } finally {
      setCheckLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckLoading(true);
    try {
      // Backend requires credentials in the check-out payload
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        email: stored?.email || user?.email,
        password: localStorage.getItem("password") || "",
      };
      await API.post("/attendance/check-out", payload);
      alert("✓ Checked out successfully");
      await fetchData();
    } catch (err) {
      console.log("CHECKOUT ERROR:", err?.response);
      alert(handleApiError(err, "Check-out failed"));
    } finally {
      setCheckLoading(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return "—";
    try {
      const d = new Date(t);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    } catch {}
    return String(t);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      if (!isNaN(date.getTime())) return date.toLocaleDateString();
    } catch {}
    return String(d);
  };

  const resolveName = (item) =>
    item.User?.name ||
    item.user?.name ||
    item.User?.email ||
    item.user?.email ||
    item.name ||
    item.employee_name ||
    usersMap[item.user_id] ||
    `User #${item.user_id ?? "—"}`;

  const title = forceMyView
    ? "My Timesheet"
    : user?.role === "HR"
    ? "Organization Attendance"
    : user?.role === "MANAGER"
    ? "Team Attendance"
    : "My Timesheet";

  const showEmployeeColumn =
    !forceMyView && (user?.role === "HR" || user?.role === "MANAGER");

  // HR + Manager + Employee can all check in/out themselves
  const canCheckInOut =
    user?.role === "EMPLOYEE" ||
    user?.role === "MANAGER" ||
    user?.role === "HR";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to={
                user?.role === "HR"
                  ? "/hr"
                  : user?.role === "MANAGER"
                  ? "/manager"
                  : "/employee"
              }
              className="text-sm text-indigo-300 hover:text-indigo-100"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-slate-400">
              {user?.role === "EMPLOYEE"
                ? "Track your check-ins and check-outs"
                : "Monitor attendance records"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="rounded-lg bg-white/10 border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              ⟳ Refresh
            </button>
            {canCheckInOut && (
              <>
                <button
                  onClick={handleCheckIn}
                  disabled={checkLoading}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {checkLoading ? "..." : "Check In"}
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={checkLoading}
                  className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400 disabled:opacity-50"
                >
                  {checkLoading ? "..." : "Check Out"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              No attendance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                    {showEmployeeColumn && (
                      <th className="px-3 py-3">Employee</th>
                    )}
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Check In</th>
                    <th className="px-3 py-3">Check Out</th>
                    <th className="px-3 py-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => {
                    const duration = calcDuration(item.check_in, item.check_out);
                    const completed = !!item.check_out;
                    return (
                      <tr
                        key={item.id ?? i}
                        className="border-b border-white/5 transition hover:bg-white/5"
                      >
                        {showEmployeeColumn && (
                          <td className="px-3 py-3 font-medium">
                            {resolveName(item)}
                          </td>
                        )}
                        <td className="px-3 py-3 text-slate-300">
                          {formatDate(item.date || item.check_in)}
                        </td>
                        <td className="px-3 py-3 text-emerald-300">
                          {formatTime(item.check_in)}
                        </td>
                        <td className="px-3 py-3 text-rose-300">
                          {formatTime(item.check_out)}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              completed
                                ? "bg-indigo-500/20 text-indigo-200"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {duration}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
