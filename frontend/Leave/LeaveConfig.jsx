import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { handleApiError } from "../utils/handleApiError.js";

export default function LeaveConfig() {
  const [name, setName] = useState("");
  const [quota, setQuota] = useState("");
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

const create = async () => {
  setError("");
  setSuccess("");

  if (!name.trim()) {
    const m = "Leave type name is required.";
    setError(m);
    alert(m);
    return;
  }

  const quotaNum = Number(quota);
  if (!quota || Number.isNaN(quotaNum) || quotaNum <= 0) {
    const m = "Quota must be a positive number.";
    setError(m);
    alert(m);
    return;
  }

  setSubmitting(true);

  try {
    await API.post("/leave/type", {
      name: name.trim(),
      quota: quotaNum,
    });

    const txt = `✓ Leave type "${name}" created successfully.`;
    setSuccess(txt);
    alert(txt);

    setName("");
    setQuota("");

  } catch (err) {
    const msg = handleApiError(err, "Failed to create leave type");
    setError(msg);
    alert(msg);
  } finally {
    setSubmitting(false);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/hr"
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
              title="Back"
            >
              ←
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Leave Configuration
              </h1>
              <p className="text-sm text-slate-400">
                Define leave types and yearly quotas for your organization
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-sm font-medium transition"
          >
            Logout
          </button>
        </header>

        {/* Form Card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create Leave Type</h2>
              <p className="text-xs text-slate-400">
                e.g. Sick Leave, Casual Leave, Paid Time Off
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-rose-100 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-emerald-100 text-sm">
              ✓ {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Leave Type Name
              </label>
              <input
                value={name}
                placeholder="e.g. Sick Leave"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none transition placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Quota (days per year)
              </label>
              <input
                type="number"
                min="1"
                value={quota}
                placeholder="e.g. 12"
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none transition placeholder:text-slate-500"
              />
            </div>

            <button
              onClick={create}
              disabled={submitting}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition shadow-lg shadow-indigo-500/30"
            >
              {submitting ? "Creating…" : "+ Create Leave Type"}
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 text-sm text-slate-300">
          <span className="font-semibold text-white">Tip: </span>
          Once created, employees can apply for this leave type from their
          dashboard. Quota represents the total days available per employee per
          year.
        </div>
      </div>
    </div>
  );
}
