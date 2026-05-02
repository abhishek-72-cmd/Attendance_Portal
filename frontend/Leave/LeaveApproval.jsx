import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { handleApiError } from "../utils/handleApiError";

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filter, setFilter] = useState("PENDING"); // PENDING | ALL | APPROVED | REJECTED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioning, setActioning] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isHR = user?.role === "HR";

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

const fetchLeaves = async (currentFilter = filter) => {
  setLoading(true);
  setError("");

  try {
    let url = "";

    if (user?.role === "MANAGER") {
      // Manager ONLY sees pending
      url = "/leave/pending";
    } else if (user?.role === "HR") {
      // HR logic
      if (currentFilter === "PENDING") {
        url = "/leave/pending";
      } else {
        url = "/leave/all";
      }
    }

    const res = await API.get(url);

    let list = Array.isArray(res.data) ? res.data : [];

    // HR filtering (frontend filtering)
    if (user?.role === "HR" && currentFilter !== "ALL" && currentFilter !== "PENDING") {
      list = list.filter(
        (l) => String(l.status).toUpperCase() === currentFilter
      );
    }

    setLeaves(list);
  } catch (err) {
    console.error(err);
    setError("Failed to load leaves");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchUserDirectory();
    fetchLeaves(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchFilter = (next) => {
    setFilter(next);
    fetchLeaves(next);
  };

  const handleAction = async (id, status) => {
    setActioning(`${id}-${status}`);
    setError("");
    try {
      await API.put(`/leave/approve/${id}`, {
        status,
        remark: status === "APPROVED" ? "Approved" : "Rejected",
      });
      const txt = `✓ Leave ${status.toLowerCase()} successfully`;
      setToast(txt);
      alert(txt);
      // Remove if currently viewing pending; else refresh
      if (filter === "PENDING") {
        setLeaves((prev) => prev.filter((l) => l.id !== id));
      } else {
        fetchLeaves(filter);
      }
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error(err);
      const msg = handleApiError(err, "Failed to update leave.");
      setError(msg);
      alert(msg);
    } finally {
      setActioning(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  const resolveName = (l) =>
    l.user?.name ||
    l.employee_name ||
    usersMap[l.user_id] ||
    `User #${l.user_id ?? "—"}`;

  const statusBadge = (s) => {
    const v = String(s || "PENDING").toUpperCase();
    if (v === "APPROVED")
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
    if (v === "REJECTED")
      return "bg-rose-500/20 text-rose-200 border-rose-400/30";
    return "bg-amber-500/20 text-amber-200 border-amber-400/30";
  };

  const tabs = isHR
    ? ["PENDING", "APPROVED", "REJECTED", "ALL"]
    : ["PENDING"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to={
                user?.role === "MANAGER"
                  ? "/manager"
                  : isHR
                    ? "/hr"
                    : "/employee"
              }
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
              title="Back"
            >
              ←
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {isHR ? "Leave Requests" : "Pending Leave Requests"}
              </h1>
              <p className="text-sm text-slate-400">
                Review and take action on leave applications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLeaves(filter)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 text-sm font-medium transition"
            >
              ⟳ Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Filter tabs (HR only sees multiple) */}
        {tabs.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => switchFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  filter === t
                    ? "bg-indigo-500/30 border-indigo-400/40 text-white"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {toast && (
          <div className="mb-4 rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-emerald-100 text-sm">
            ✓ {toast}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-rose-100 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              {filter === "PENDING" ? "Pending" : filter}
            </p>
            <p className="text-3xl font-bold mt-1">{leaves.length}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Reviewer
            </p>
            <p className="text-lg font-semibold mt-1 truncate">
              {user?.name || "—"}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Role
            </p>
            <p className="text-lg font-semibold mt-1">{user?.role || "—"}</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 text-center text-slate-300">
            Loading leaves…
          </div>
        ) : leaves.length === 0 ? (
          <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-lg font-semibold">All caught up!</p>
            <p className="text-sm text-slate-400 mt-1">
              No {filter.toLowerCase()} leave requests right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaves.map((l) => {
              const status = String(l.status || "PENDING").toUpperCase();
              const canTakeAction = user?.role === "MANAGER";
const isPending = status === "PENDING" && canTakeAction;
              return (
                <div
                  key={l.id}
                  className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{resolveName(l)}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {l.user?.email || l.leave_type?.name || ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-1 text-xs rounded-full border ${statusBadge(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-xs text-slate-400">Start</p>
                      <p className="font-medium">{formatDate(l.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">End</p>
                      <p className="font-medium">{formatDate(l.end_date)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1">Reason</p>
                    <p className="text-sm bg-black/20 rounded-md p-2 border border-white/5 min-h-[2.5rem]">
                      {l.reason || "—"}
                    </p>
                  </div>

                  {isPending ? (
                    <div className="flex gap-2">
                      <button
                        disabled={actioning === `${l.id}-APPROVED`}
                        onClick={() => handleAction(l.id, "APPROVED")}
                        className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition"
                      >
                        {actioning === `${l.id}-APPROVED`
                          ? "Approving…"
                          : "✓ Approve"}
                      </button>
                      <button
                        disabled={actioning === `${l.id}-REJECTED`}
                        onClick={() => handleAction(l.id, "REJECTED")}
                        className="flex-1 px-3 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition"
                      >
                        {actioning === `${l.id}-REJECTED`
                          ? "Rejecting…"
                          : "✕ Reject"}
                      </button>
                    </div>
                  ) : (
                    l.remark && (
                      <p className="text-xs text-slate-400">
                        Remark: <span className="text-slate-200">{l.remark}</span>
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
