import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../api"; // 👈 ALSO MISSING


export default function ManagerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Manager";

    useEffect(() => {
  API.get("/auth/manager-data").catch((err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      alert("Access denied — Manager role required.");
      localStorage.clear();
      navigate("/");
    }
  });
}, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const myActions = [
    {
      to: "/checkin",
      title: "Check In / Check Out",
      desc: "Clock in or out and track your hours",
      gradient: "from-indigo-500 to-blue-600",
      icon: "⏱",
    },
    {
      to: "/timesheet",
      title: "My Timesheet",
      desc: "Review your attendance history",
      gradient: "from-purple-500 to-indigo-600",
      icon: "📅",
    },
    {
      to: "/leave",
      title: "My Leaves",
      desc: "Apply for leave or check status",
      gradient: "from-pink-500 to-purple-600",
      icon: "🌴",
    },
  ];

  const teamActions = [
    {
      to: "/timesheet",
      title: "Team Attendance",
      desc: "View attendance for your team",
      gradient: "from-emerald-500 to-teal-600",
      icon: "👥",
    },
    {
      to: "/leave-approval",
      title: "Leave Approvals",
      desc: "Approve or reject team leave requests",
      gradient: "from-amber-500 to-orange-600",
      icon: "✅",
    },
  ];

  const Card = ({ a }) => (
    <Link
      to={a.to}
      className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 hover:scale-[1.02] transition"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-2xl shadow-lg mb-4`}
      >
        {a.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{a.title}</h3>
      <p className="text-sm text-slate-300">{a.desc}</p>
      <div className="mt-4 text-indigo-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
        Open →
      </div>
    </Link>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-10 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-slate-400 text-sm">Manager Portal</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hi {name} 👋
            </h1>
            <p className="text-slate-300 mt-2">Manage your tasks and your team.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* My Actions */}
        <div className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">My Actions</h2>
            <p className="text-sm text-slate-400">Your personal employee tools</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myActions.map((a) => (
              <Card key={a.title} a={a} />
            ))}
          </div>
        </div>

        {/* Team Management */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Team Management</h2>
            <p className="text-sm text-slate-400">Oversee and approve your team's activity</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamActions.map((a) => (
              <Card key={a.title} a={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
