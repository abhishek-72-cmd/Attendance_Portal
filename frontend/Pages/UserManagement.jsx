import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { handleApiError } from "../utils/handleApiError";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    manager_id: "",
  });
  const [assignFor, setAssignFor] = useState(null);
  const [managerId, setManagerId] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(handleApiError(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Name, email and password are required");
      return;
    }
    try {
      await API.post("/users/create", {
        ...form,
        manager_id: form.manager_id ? Number(form.manager_id) : null,
      });
      alert(`✓ User "${form.name}" created successfully`);
      setShowCreate(false);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        manager_id: "",
      });
      fetchUsers();
    } catch (err) {
      alert(handleApiError(err, "Failed to create user"));
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    setActionId(id);
    try {
      await API.put(`/users/deactivate/${id}`);
      alert("✓ User deactivated");
      fetchUsers();
    } catch (err) {
      alert(handleApiError(err, "Failed to deactivate"));
    } finally {
      setActionId(null);
    }
  };

  const handleAssignManager = async (id) => {
    if (!managerId) {
      alert("Enter a manager ID");
      return;
    }
    setActionId(id);
    try {
      await API.put(`/users/assign-manager/${id}`, {
        manager_id: Number(managerId),
      });
      const manager = users.find((u) => u.id === Number(managerId));
      const employee = users.find((u) => u.id === id);
      alert(
        `✓ Manager assigned successfully\n\n${employee?.name || "User"} → ${
          manager?.name || `Manager #${managerId}`
        }`
      );
      setAssignFor(null);
      setManagerId("");
      fetchUsers();
    } catch (err) {
      alert(handleApiError(err, "Failed to assign manager"));
    } finally {
      setActionId(null);
    }
  };

  const roleColor = (role) => {
    switch (role) {
      case "HR":
        return "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";
      case "MANAGER":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/hr"
              className="text-sm text-indigo-300 hover:text-indigo-100"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-slate-400">
              {users.length} user{users.length !== 1 ? "s" : ""} in your organization
            </p>
          </div>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
          >
            {showCreate ? "Close" : "+ Create User"}
          </button>
        </div>

        {showCreate && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold">New User</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              >
                <option value="EMPLOYEE" className="bg-slate-900">EMPLOYEE</option>
                <option value="MANAGER" className="bg-slate-900">MANAGER</option>
                <option value="HR" className="bg-slate-900">HR</option>
              </select>
              <input
                placeholder="Manager ID (optional)"
                value={form.manager_id}
                onChange={(e) =>
                  setForm({ ...form, manager_id: e.target.value })
                }
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none sm:col-span-2"
              />
            </div>
            <button
              onClick={handleCreate}
              className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400"
            >
              Create
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-slate-400">No users found.</div>
          ) : (
            <div className="grid gap-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold">
                      {(u.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-slate-400">
                        {u.email} · ID #{u.id}
                        {u.manager_id ? ` · Mgr #${u.manager_id}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${roleColor(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                    {u.is_active === false && (
                      <span className="rounded-full bg-slate-500/20 px-2.5 py-1 text-xs text-slate-300">
                        Inactive
                      </span>
                    )}

                    {assignFor === u.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          placeholder="Manager ID"
                          value={managerId}
                          onChange={(e) => setManagerId(e.target.value)}
                          className="w-28 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs focus:border-indigo-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAssignManager(u.id)}
                          disabled={actionId === u.id}
                          className="rounded-lg bg-indigo-500 px-3 py-1 text-xs hover:bg-indigo-400 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setAssignFor(null);
                            setManagerId("");
                          }}
                          className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setAssignFor(u.id);
                            setManagerId(u.manager_id ?? "");
                          }}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
                        >
                          Assign Mgr
                        </button>
                        <button
                          onClick={() => handleDeactivate(u.id)}
                          disabled={actionId === u.id}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
