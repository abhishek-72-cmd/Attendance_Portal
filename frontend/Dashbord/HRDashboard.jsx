import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../api";

export default function HRDashboard() {
  const navigate = useNavigate();

  // Read name from the stored user object first, fall back to legacy "name" key
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  const name = user?.name || localStorage.getItem("name") || "HR Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const sections = [
    {
      title: "My Attendance",
      desc: "Mark your own check-in / check-out",
      items: [
        {
          to: "/checkin",
          title: "Check In / Check Out",
          desc: "Clock in or out and track your hours",
          gradient: "from-emerald-500 to-teal-600",
          icon: "⏱",
        },
        {
          to: "/timesheet",
          title: "My Timesheet",
          desc: "View your own attendance record",
          gradient: "from-cyan-500 to-blue-600",
          icon: "📅",
        },
      ],
    },
    {
      title: "Organization",
      desc: "Monitor company-wide attendance and leaves",
      items: [
        {
          to: "/timesheet",
          title: "Organization Attendance",
          desc: "View attendance for all employees",
          gradient: "from-indigo-500 to-blue-600",
          icon: "🏢",
        },
        {
          to: "/leave",
          title: "All Leave Requests",
          desc: "Browse every leave request",
          gradient: "from-purple-500 to-indigo-600",
          icon: "📋",
        },
        {
          to: "/leave-approval",
          title: "Approve / Reject Leaves",
          desc: "View pending, approved & rejected leaves",
          gradient: "from-amber-500 to-orange-600",
          icon: "✅",
        },
      ],
    },
    {
      title: "User Management",
      desc: "Create users, assign managers, and manage access",
      items: [
        {
          to: "/users",
          title: "Manage Users",
          desc: "Create, deactivate, and assign managers",
          gradient: "from-emerald-500 to-teal-600",
          icon: "👥",
        },
      ],
    },
    {
      title: "Leave Configuration",
      desc: "Configure leave types and policies",
      items: [
        {
          to: "/leave-config",
          title: "Configure Leave Types",
          desc: "Add or edit leave categories",
          gradient: "from-pink-500 to-purple-600",
          icon: "⚙️",
        },
      ],
    },
  ];


  useEffect(() => {
  API.get("/auth/hr-only").catch((err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      alert("Access denied — HR role required.");
      localStorage.clear();
      navigate("/");
    }
  });
}, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 px-4 py-10 relative overflow-hidden">
      <div className="absolute top-0 -right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-slate-400 text-sm">HR Portal</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome, {name} 🛡️
            </h1>
            <p className="text-slate-300 mt-2">
              Manage your organization from one place.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-400">{section.desc}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((a) => (
                  <Link
                    key={a.to + a.title}
                    to={a.to}
                    className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 hover:scale-[1.02] transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-2xl shadow-lg mb-4`}
                    >
                      {a.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {a.title}
                    </h3>
                    <p className="text-sm text-slate-300">{a.desc}</p>
                    <div className="mt-4 text-indigo-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                      Open →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
