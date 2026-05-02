import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { handleApiError, calcLeaveDays } from "../utils/handleApiError";

export default function ApplyLeave() {
  const [form, setForm] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

 // ✅ Fetch leave types
  const fetchLeaveTypes = async () => {
    try {
      const res = await API.get("/leave/types");
console.log("LEAVE TYPES:", res.data);
      if (Array.isArray(res.data)) {
const responseData = res.data;

if (Array.isArray(responseData)) {
  setLeaveTypes(responseData);
} else if (Array.isArray(responseData.data)) {
  setLeaveTypes(responseData.data);
} else {
  setLeaveTypes([]);
}
      } else {
        setLeaveTypes(res.data.data || []);
      }
    } catch (err) {
      console.error("Leave types error:", err);
      setError("Failed to load leave types");
    }
  };



  const fetchLeaves = async () => {
    if (!user) {
      navigate("/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res =
        user.role === "HR"
          ? await API.get("/leave/all")
          : await API.get("/leave/my");
const responseData = res.data;

if (Array.isArray(responseData)) {
  setLeaves(responseData);
} else if (Array.isArray(responseData.data)) {
  setLeaves(responseData.data);
} else {
  setLeaves([]);
}

    } catch (err) {
      console.error(err);
      setError(handleApiError(err, "Failed to load leaves"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = calcLeaveDays(form.start_date, form.end_date);

  const apply = async () => {
    setError("");
    setSuccess("");

    if (!form.leave_type_id) {
      const msg = "Please select a Leave Type";
      setError(msg);
      alert(msg);
      return;
    }
    if (!form.start_date || !form.end_date) {
      const msg = "Start date and end date are required";
      setError(msg);
      alert(msg);
      return;
    }
    if (days <= 0) {
      const msg = "End date must be the same as or after the start date";
      setError(msg);
      alert(msg);
      return;
    }

    setSubmitting(true);
    try {
    await API.post("/leave/apply", {
  leave_type_id: Number(form.leave_type_id),
  start_date: form.start_date,
  end_date: form.end_date,
  reason: form.reason,
});
      const txt = `✓ Leave application submitted (${days} day${days > 1 ? "s" : ""})`;
      setSuccess(txt);
      alert(txt);
      setForm({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      const msg = handleApiError(err, "Failed to apply for leave");
      setError(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (s) => {
    const v = String(s || "").toUpperCase();
    if (v === "APPROVED")
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (v === "REJECTED")
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      if (!isNaN(date.getTime())) return date.toLocaleDateString();
    } catch {}
    return String(d);
  };

  const isHR = user?.role === "HR";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            to={
              isHR
                ? "/hr"
                : user?.role === "MANAGER"
                ? "/manager"
                : "/employee"
            }
            className="text-sm text-indigo-300 hover:text-indigo-100"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {isHR ? "All Leave Requests" : "Apply for Leave"}
          </h1>
          <p className="text-sm text-slate-400">
            {isHR
              ? "Organization-wide leave overview"
              : "Submit a new leave request and track your history"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold">New Application</h2>

            {error && (
              <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Leave Type
                </label>
                <select
                  value={form.leave_type_id}
                  onChange={(e) =>
                    setForm({ ...form, leave_type_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                >
                  <option value="" className="bg-slate-900">
                    {leaveTypes.length === 0
                      ? "No leave types available"
                      : "Select a leave type"}
                  </option>
               {leaveTypes?.length > 0 &&
  leaveTypes.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900">
                      {t.name}
                      {t.quota ? ` (${t.quota} days/yr)` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm({ ...form, start_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm({ ...form, end_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Auto-calculated leave count */}
              <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm">
                <span className="text-slate-300">Total leave days: </span>
                <span className="font-bold text-indigo-200">
                  {days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "—"}
                </span>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Reason
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the reason"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <button
                onClick={apply}
                disabled={submitting}
                className="mt-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Apply for Leave"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold">
              {isHR ? "All Leaves" : "My Leaves"}
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({leaves.length})
              </span>
            </h2>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading...</div>
            ) : leaves.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                No leave records yet.
              </div>
            ) : (
              <div className="grid max-h-[28rem] gap-3 overflow-y-auto pr-1">
                {leaves.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        {isHR && (
                          <div className="text-xs text-slate-400">
                            {l.user?.name ||
                              l.name ||
                              `User #${l.user_id ?? "—"}`}
                          </div>
                        )}
                        <div className="text-sm font-medium">
                          {formatDate(l.start_date)} → {formatDate(l.end_date)}
                        </div>
                        { leaveTypes.find((t) => t.id === l.leave_type_id)?.name ||"—"} (
                          <div className="text-xs text-indigo-300 mt-0.5">
                            {l.leave_type.name}
                          </div>
                        )
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor(
                          l.status
                        )}`}
                      >
                        {l.status || "PENDING"}
                      </span>
                    </div>
                    {l.reason && (
                      <p className="text-sm text-slate-300">{l.reason}</p>
                    )}
                    {l.remark && (
                      <p className="mt-1 text-xs text-slate-400">
                        Remark: {l.remark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
