import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { handleApiError } from "../utils/handleApiError";

export default function CheckInOut() {
  const [loading, setLoading] = useState(null); // 'in' | 'out' | null
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIn = async () => {
    setError("");
    setMessage("");
    setLoading("in");
    try {
      const res = await API.post("/attendance/check-in");
      const t = res?.data?.check_in
        ? new Date(res.data.check_in).toLocaleTimeString()
        : new Date().toLocaleTimeString();
      const txt = `✓ Checked in successfully at ${t}`;
      setMessage(txt);
      alert(txt);
    } catch (err) {
      console.error(err);
      const msg = handleApiError(
        err,
        "Already checked in or unable to check in. Please try again."
      );
      setError(msg);
      alert(msg);
    } finally {
      setLoading(null);
    }
  };

  const checkOut = async () => {
    setError("");
    setMessage("");
    setLoading("out");
    try {
      // Backend requires the user's credentials in the check-out payload
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        email: stored?.email || user?.email,
        password: localStorage.getItem("password") || "",
      };
      const res = await API.post("/attendance/check-out", payload);
      const t = res?.data?.check_out
        ? new Date(res.data.check_out).toLocaleTimeString()
        : new Date().toLocaleTimeString();
      const txt = `✓ Checked out successfully at ${t}`;
      setMessage(txt);
      alert(txt);
    } catch (err) {
      console.error(err);
      const msg = handleApiError(
        err,
        "Unable to check out. Please ensure you have checked in first."
      );
      setError(msg);
      alert(msg);
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to={
                user?.role === "HR"
                  ? "/hr"
                  : user?.role === "MANAGER"
                  ? "/manager"
                  : "/employee"
              }
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
              title="Back"
            >
              ←
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Attendance
              </h1>
              <p className="text-sm text-slate-400">
                Hello {user?.name || "there"}, mark your presence for today
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

        {/* Clock Card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
            Current time
          </p>
          <p className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent tabular-nums">
            {timeStr}
          </p>
          <p className="text-sm text-slate-300 mt-2">{dateStr}</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-emerald-100 text-sm">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-rose-100 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={checkIn}
            disabled={loading !== null}
            className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:bg-emerald-500/10 hover:border-emerald-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                →
              </div>
              <div>
                <p className="text-lg font-semibold">Check In</p>
                <p className="text-xs text-slate-400">Start your workday</p>
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-300 mt-3">
              {loading === "in" ? "Checking in…" : "Tap to check in"}
            </p>
          </button>

          <button
            onClick={checkOut}
            disabled={loading !== null}
            className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:bg-rose-500/10 hover:border-rose-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                ←
              </div>
              <div>
                <p className="text-lg font-semibold">Check Out</p>
                <p className="text-xs text-slate-400">End your workday</p>
              </div>
            </div>
            <p className="text-sm font-medium text-rose-300 mt-3">
              {loading === "out" ? "Checking out…" : "Tap to check out"}
            </p>
          </button>
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <Link
            to="/timesheet"
            className="text-sm text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline"
          >
            View my timesheet →
          </Link>
        </div>
      </div>
    </div>
  );
}
